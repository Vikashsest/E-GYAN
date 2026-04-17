import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ILike, In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/entities/user.entity';
import { Announcement } from '../student/entities/announcement.entity';
import getPdfTotalPages from 'src/common/utils/Helper/pdf.parse';
import { Chapter } from './entities/chapter.entity';
import { NextcloudService } from '../nextcloud/nextcloud.service';
import { generatePublicLink } from 'src/common/utils/nextcloud.config';
import { StudentActivity } from '../student/entities/student-activity.entity';
import { IsNull } from 'typeorm';
import { Simulation } from './entities/simulation';
import { FindOptionsWhere } from 'typeorm';
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookrepo: Repository<Book>,
    private readonly nextcloudService: NextcloudService,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(StudentActivity)
    private readonly studentActivityRepo: Repository<StudentActivity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
    @InjectRepository(Simulation)
    private readonly simulationRepo: Repository<Simulation>,
  ) {}

  async createBook(bookDto: CreateBookDto, user: User): Promise<Book> {
    if (bookDto.fileUrl) {
      try {
        const totalPage = await getPdfTotalPages(bookDto.fileUrl);
        bookDto.totalPages = totalPage;
      } catch (error) {
        console.error('Error reading PDF pages:', error);
      }
    }
    const newBook = this.bookrepo.create({
      ...bookDto,
      uploadedBy: user,
    });

    const savedBook = await this.bookrepo.save(newBook);
    const message = `📘 New book uploaded: "${savedBook.bookName}" in ${savedBook.subject || 'General'} by ${user.role}`;
    const announcement = this.announcementRepo.create({
      message,
      isActive: true,
    });

    await this.announcementRepo.save(announcement);

    return savedBook;
  }

  async findOneById(id: number): Promise<Book | null> {
    return this.bookrepo.findOne({
      where: { id },
      select: [
        'id',
        'bookName',
        'subject',
        'category',
        'educationLevel',
        'language',
        'stateBoard',
        // 'resourceType',
        'fileUrl',
        'thumbnail',
        'uploadedAt',
      ],
      relations: ['chapters'],
    });
  }

  async findAll() {
    const books = await this.bookrepo.find({
      relations: ['chapters'],
      order: {
        uploadedAt: 'ASC',
      },
    });

    return books.map((book) => {
      const sortedChapters = book.chapters.sort(
        (a, b) => a.chapterNumber - b.chapterNumber,
      );
      const firstChapter = sortedChapters[0];
      return {
        ...book,
        thumbnail: firstChapter?.thumbnail || book.thumbnail || null,
        fileUrl: firstChapter?.fileUrl || book.fileUrl || null,
        thumbnailProxyUrl: book.thumbnail
          ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(book.thumbnail)}`
          : null,

        chapters: sortedChapters.map((chap) => ({
          id: chap.id,
          chapterNumber: chap.chapterNumber,
          fileUrl: chap.fileUrl,
          proxyUrl: `${process.env.API_URL}/books/proxy/file?url=${encodeURIComponent(chap.fileUrl)}`,
          thumbnail: chap.thumbnail,
          thumbnailProxyUrl: chap.thumbnail
            ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(chap.thumbnail)}`
            : null,
        })),
      };
    });
  }

  // async findByUploaderId(userId: number) {
  //   const books = await this.bookrepo.find({
  //     where: { uploadedBy: { id: userId } },
  //     relations: ['uploadedBy', 'chapters'],
  //     order: { uploadedAt: 'DESC' },
  //   });
  //   console.log('books', books);

  //   return books.map((book) => {
  //     const sortedChapters = book.chapters.sort(
  //       (a, b) => a.chapterNumber - b.chapterNumber,
  //     );
  //     const firstChapter = sortedChapters[0];
  //     return {
  //       ...book,
  //       thumbnail: firstChapter?.thumbnail || book.thumbnail || null,
  //       fileUrl: firstChapter?.fileUrl || book.fileUrl || null,
  //       chapters: sortedChapters.map((chap) => ({
  //         id: chap.id,
  //         chapterNumber: chap.chapterNumber,
  //         fileUrl: chap.fileUrl,
  //         thumbnail: chap.thumbnail,
  //       })),
  //     };
  //   });
  // }

  async getDashboardStats() {
    const totalBooks = await this.bookrepo.count();
    const totalStudents = await this.userRepo.count({
      where: { role: UserRole.STUDENT },
    });
    const totalTeachers = await this.userRepo.count({
      where: { role: UserRole.TEACHER },
    });
    const booksPerSubject = await this.bookrepo
      .createQueryBuilder('book')
      .select('book.subject', 'subject')
      .addSelect('COUNT(*)', 'count')
      .where('book.subject IS NOT NULL')
      .groupBy('book.subject')
      .getRawMany();
    const books = await this.bookrepo.find();
    const subjectWiseUploads = {};

    books.forEach((book) => {
      const subject = book.subject;
      const month = book.uploadedAt.toLocaleString('default', {
        month: 'short',
      });

      if (!subjectWiseUploads[subject]) {
        subjectWiseUploads[subject] = [];
      }

      const monthEntry = subjectWiseUploads[subject].find(
        (m) => m.month === month,
      );
      if (monthEntry) {
        monthEntry.uploads++;
      } else {
        subjectWiseUploads[subject].push({ month, uploads: 1 });
      }
    });
    return {
      totalBooks,
      totalTeachers,
      totalStudents,
      booksPerSubject,
      subjectWiseUploads,
    };
  }

  async getSubjects(className?: string) {
    let query = this.bookrepo.createQueryBuilder('book').select('book.subject');

    if (className) {
      query = query.where(
        'TRIM(LOWER(book.educationLevel)) = TRIM(LOWER(:className))',
        { className },
      );
    }
    const subjects = await query.getMany();
    const uniqueSubjects = [
      ...new Set(subjects.map((b) => b.subject?.trim()).filter(Boolean)),
    ];

    return uniqueSubjects;
  }
  async getBooks(filters: {
    className?: string;
    subject?: string;
    category?: string;
  }) {
    const books = await this.bookrepo.find({
      relations: ['chapters'],
      order: { uploadedAt: 'ASC' },
    });
    let filteredBooks = books;
    if (filters.className) {
      filteredBooks = filteredBooks.filter(
        (b) =>
          b.educationLevel?.toLowerCase() === filters.className?.toLowerCase(),
      );
    }
    if (filters.subject) {
      filteredBooks = filteredBooks.filter(
        (b) => b.subject?.toLowerCase() === filters.subject?.toLowerCase(),
      );
    }
    if (filters.category) {
      filteredBooks = filteredBooks.filter(
        (b) => b.category?.toLowerCase() === filters.category?.toLowerCase(),
      );
    }

    return filteredBooks.map((book) => {
      const firstChapterThumbnail = book.chapters?.[0]?.thumbnail;

      return {
        id: book.id,
        bookName: book.bookName,
        category: book.category,
        subject: book.subject,
        educationLevel: book.educationLevel,
        language: book.language,
        uploadedAt: book.uploadedAt,
        thumbnail: firstChapterThumbnail || book.thumbnail || null,
        thumbnailProxyUrl:
          firstChapterThumbnail || book.thumbnail
            ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(firstChapterThumbnail || book.thumbnail)}`
            : null,
      };
    });
  }

  async findAllEducationLevels(): Promise<string[]> {
    const books = await this.bookrepo.find({
      select: ['educationLevel'],
    });
    const normalized = books
      .map((b) => b.educationLevel?.trim())
      .filter((v) => v)
      .map((v) => v.toLowerCase())
      .map((v) => v.replace('class', 'Class'));
    const unique = Array.from(new Set(normalized));
    const sorted = unique.sort((a, b) => {
      const numA = parseInt(a.replace('Class ', ''), 10);
      const numB = parseInt(b.replace('Class ', ''), 10);
      return numA - numB;
    });

    return sorted;
  }

  async remove(id: number) {
    return await this.bookrepo.delete(id);
  }
  async getCategories(): Promise<string[]> {
    const categories = await this.bookrepo
      .createQueryBuilder('book')
      .select('DISTINCT book.category', 'category')
      .where('book.category IS NOT NULL')
      .getRawMany();

    return categories.map((c) => c.category);
  }
  async updateBook(
    id: number,
    updateBookDto: any,
    file?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
    const book = await this.bookrepo.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Main file handling (PDF / Video / Audio)
    if (file) {
      updateBookDto.fileUrl = file.path || file.filename;
      updateBookDto.fileType = file.mimetype;
    }

    // Thumbnail handling - Nextcloud upload
    if (thumbnail) {
      const thumbRemotePath = `books/thumbnails/book-${id}.jpg`;

      // Upload to Nextcloud
      const uploadedThumbPath = await this.nextcloudService.uploadFile(
        thumbnail.path,
        thumbRemotePath,
      );

      // Generate public URL
      const thumbnailUrl = await generatePublicLink(uploadedThumbPath);

      // Save URL in DB
      updateBookDto.thumbnail = thumbnailUrl;
    }

    const updatedBook = Object.assign(book, updateBookDto);
    return this.bookrepo.save(updatedBook);
  }

  async getChaptersByBookId(bookId: number): Promise<any[]> {
    const chapters = await this.chapterRepo.find({
      where: {
        book: { id: bookId },
        parentChapter: IsNull(),
      },
      order: { chapterNumber: 'ASC', id: 'ASC' },
      select: [
        'id',
        'chapterNumber',
        'fileUrl',
        'thumbnail',
        'resourceType',
        'totalPages',
      ],
    });
    return chapters.map((ch) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber,
      fileUrl: ch.fileUrl,
      proxyUrl: `${process.env.API_URL}/books/proxy/file?url=${encodeURIComponent(ch.fileUrl)}`,
      thumbnail: ch.thumbnail,
      thumbnailProxyUrl: ch.thumbnail
        ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(ch.thumbnail)}`
        : null,
      resourceType: ch.resourceType || 'pdf',
      totalPages: ch.totalPages,
    }));
  }

  async getChapterFileStream(bookId: number, chapterId: number) {
    const chapter = await this.chapterRepo.findOne({
      where: { id: chapterId, book: { id: bookId } },
      select: ['id', 'fileUrl'],
    });

    if (!chapter || !chapter.fileUrl) {
      throw new NotFoundException('File URL not found');
    }

    let fileUrl = chapter.fileUrl;
    if (fileUrl.includes('/index.php/s/') && !fileUrl.endsWith('/download')) {
      fileUrl = fileUrl.replace(/\/+$/, '') + '/download';
    }

    return fileUrl;
  }

  async deleteChapter(chapterId: number): Promise<{ message: string }> {
    try {
      const chapter = await this.chapterRepo.findOne({
        where: { id: chapterId },
        relations: ['book'],
      });
      if (!chapter)
        throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
      await this.studentActivityRepo.delete({ chapter: { id: chapterId } });
      await this.chapterRepo.remove(chapter);

      return {
        message: `Chapter ${chapter.chapterNumber} of book "${chapter.book.bookName}" deleted successfully`,
      };
    } catch (err) {
      console.error('Delete chapter error:', err);
      throw new InternalServerErrorException('Failed to delete chapter');
    }
  }

  async addChapter(
    bookId: number,
    body: {
      chapterNumber: number;
      resourceType?: 'pdf' | 'video' | 'audio' | 'simulation';
      videoUrl?: string;
      audioUrl?: string;
    },
    file?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
    const book = await this.bookrepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    let fileUrl: string | undefined;
    let totalPages: number | undefined;
    let thumbnailUrl: string | undefined;

    const resourceType = body.resourceType || 'pdf';
    if (resourceType === 'pdf') {
      if (!file) throw new BadRequestException('PDF file required');

      const ext = file.originalname.split('.').pop()?.toLowerCase();
      const remotePath = `books/${bookId}/chapters/chapter-${body.chapterNumber}.${ext}`;

      const uploaded = await this.nextcloudService.uploadFile(
        file.path,
        remotePath,
      );

      fileUrl = await generatePublicLink(uploaded);
      totalPages = await getPdfTotalPages(file.path);
    }

    if (
      resourceType === 'video' ||
      resourceType === 'audio' ||
      resourceType === 'simulation'
    ) {
      if (!body.videoUrl && body.audioUrl)
        throw new BadRequestException('Video/Audio URL required');
      fileUrl = body.videoUrl || body.audioUrl;
    }
    if (thumbnail) {
      const thumbPath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;
      const uploadedThumb = await this.nextcloudService.uploadFile(
        thumbnail.path,
        thumbPath,
      );
      thumbnailUrl = await generatePublicLink(uploadedThumb);
    }

    const chapter = this.chapterRepo.create({
      chapterNumber: body.chapterNumber,
      resourceType,
      fileUrl,
      totalPages,
      thumbnail: thumbnailUrl,
      book,
      parentChapter: null,
    });

    const saved = await this.chapterRepo.save(chapter);

    return {
      ...saved,
      displayName: `Chapter ${saved.chapterNumber}`,
    };
  }

  // async getChaptersMeta(bookId: number) {
  //   const chapters = await this.chapterRepo.find({
  //     where: {
  //       book: { id: bookId },
  //       parentChapter: IsNull(), // 🔥 only chapters
  //     },
  //     relations: ['parts'],
  //     order: { chapterNumber: 'ASC' },
  //   });
  //   console.log('chaptetrs logs', chapters);
  //   return chapters.map((ch) => ({
  //     id: ch.id,
  //     chapterNumber: ch.chapterNumber,
  //     chapterName: ch.chapterName,
  //     resourceType: ch.resourceType,
  //     totalPages: ch.totalPages,
  //     thumbnail: ch.thumbnail,

  //     parts:
  //       ch.parts?.map((p) => ({
  //         id: p.id,
  //         chapterNumber: p.chapterNumber,
  //         chapterName: p.chapterName,
  //         resourceType: p.resourceType,
  //         totalPages: p.totalPages,
  //         thumbnail: p.thumbnail || ch.thumbnail, // fallback
  //         fileUrl: p.fileUrl,
  //       })) || [],
  //   }));
  // }

  async getChaptersMeta(bookId: number) {
    const book = await this.bookrepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const chapters = await this.chapterRepo.find({
      where: {
        book: { id: bookId },
        parentChapter: IsNull(), // ✅ only main chapters
      },
      relations: ['parts'],
      order: { chapterNumber: 'ASC', id: 'ASC' },
    });

    return chapters
      .filter((ch) => !ch.parentChapter)
      .map((ch) => ({
        id: ch.id,
        chapterNumber: ch.chapterNumber,
        chapterName: ch.chapterName,
        resourceType: ch.resourceType || 'pdf',
        totalPages: ch.totalPages,
        thumbnail: ch.thumbnail,
        thumbnailProxyUrl: ch.thumbnail
          ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(ch.thumbnail)}`
          : null,
        fileUrl: ch.fileUrl,
        proxyUrl: `${process.env.API_URL}/books/${bookId}/chapters/${ch.id}/file`,
        parts:
          ch.parts?.map((p) => ({
            id: p.id,
            chapterNumber: p.chapterNumber,
            chapterName: p.chapterName,
            resourceType: p.resourceType || 'pdf',
            totalPages: p.totalPages,
            thumbnail: p.thumbnail,
            thumbnailProxyUrl: p.thumbnail
              ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(p.thumbnail)}`
              : null,
            fileUrl: p.fileUrl,
            proxyUrl: `${process.env.API_URL}/books/${bookId}/chapters/${p.id}/file`,
          })) || [],
      }));
  }

  async createSimulation(data: {
    title: string;
    subject: string;
    topic: string;
    grade: string;
    link: string;
    image?: string;
  }) {
    const simulation = this.simulationRepo.create(data);
    return await this.simulationRepo.save(simulation);
  }

  async fetechAllSimulations() {
    return await this.simulationRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
  async addPart(
    bookId: number,
    parentChapterId: number,
    body: {
      partNumber: number;
      chapterName?: string;
      resourceType?: 'pdf' | 'video' | 'audio' | 'simulation';
      videoUrl?: string;
    },
    file?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
    const book = await this.bookrepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const parentChapter = await this.chapterRepo.findOne({
      where: { id: parentChapterId, book: { id: bookId } },
    });

    if (!parentChapter) throw new NotFoundException('Parent chapter not found');

    let fileUrl: string | undefined;
    let totalPages: number | undefined;
    let thumbnailUrl: string | undefined;

    const resourceType = body.resourceType || 'pdf';

    // 📌 resource
    if (resourceType === 'pdf') {
      if (!file) throw new BadRequestException('PDF required');

      const ext = file.originalname.split('.').pop()?.toLowerCase();
      const path = `books/${bookId}/chapters/${parentChapterId}/parts/part-${body.partNumber}.${ext}`;

      const uploaded = await this.nextcloudService.uploadFile(file.path, path);
      fileUrl = await generatePublicLink(uploaded);
      totalPages = await getPdfTotalPages(file.path);
    }

    if (
      resourceType === 'video' ||
      resourceType === 'audio' ||
      resourceType === 'simulation'
    ) {
      if (!body.videoUrl)
        throw new BadRequestException('Video/Audio URL required');
      fileUrl = body.videoUrl;
    }

    // 📌 thumbnail fallback
    if (thumbnail) {
      const thumbPath = `books/${bookId}/chapters/${parentChapterId}/parts/thumbnails/part-${body.partNumber}.jpg`;
      const uploadedThumb = await this.nextcloudService.uploadFile(
        thumbnail.path,
        thumbPath,
      );
      thumbnailUrl = await generatePublicLink(uploadedThumb);
    } else {
      thumbnailUrl = parentChapter.thumbnail;
    }

    const part = this.chapterRepo.create({
      chapterNumber: body.partNumber,
      chapterName: body.chapterName,
      resourceType,
      fileUrl,
      totalPages,
      thumbnail: thumbnailUrl,
      book,
      parentChapter, // 🔥 MUST NOT BE NULL
    });

    const saved = await this.chapterRepo.save(part);

    return {
      ...saved,
      displayName: `Chapter ${parentChapter.chapterNumber} Part ${saved.chapterNumber}`,
    };
  }

  async getParts(bookId: number, chapterId: number) {
    const chapter = await this.chapterRepo.findOne({
      where: { id: chapterId, book: { id: bookId } },
    });

    if (!chapter) throw new NotFoundException('Chapter not found');

    const parts = await this.chapterRepo.find({
      where: {
        parentChapter: { id: chapterId },
        book: { id: bookId },
      },
      order: { chapterNumber: 'ASC' },
    });

    return parts.map((part) => {
      const resolvedThumbnail = part.thumbnail || chapter.thumbnail;

      return {
        id: part.id,
        chapterNumber: part.chapterNumber,
        chapterName: part.chapterName,
        resourceType: part.resourceType,
        totalPages: part.totalPages,
        fileUrl: part.fileUrl,
        proxyUrl: `${process.env.API_URL}/books/${bookId}/chapters/${part.id}/file`,

        // 🟢 return fallback thumbnail
        thumbnail: resolvedThumbnail,
        thumbnailProxyUrl: resolvedThumbnail
          ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(resolvedThumbnail)}`
          : null,

        displayName: `Chapter ${chapter.chapterNumber} Part ${part.chapterNumber}`,
      };
    });
  }

  // async getParts(bookId: number, chapterId: number) {
  //   const chapter = await this.chapterRepo.findOne({
  //     where: { id: chapterId, book: { id: bookId } },
  //   });

  //   if (!chapter) throw new NotFoundException('Chapter not found');

  //   const parts = await this.chapterRepo.find({
  //     where: {
  //       parentChapter: { id: chapterId },
  //       book: { id: bookId },
  //     },
  //     order: { chapterNumber: 'ASC' },
  //   });

  //   return parts.map((part) => ({
  //     ...part,
  //     displayName: `Chapter ${chapter.chapterNumber} Part ${part.chapterNumber}`,
  //   }));
  // }

  // book.service.ts
  async getBooksByCategory(category?: string) {
    const query = this.bookrepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.chapters', 'chapter');

    if (category) {
      query.andWhere('book.category = :category', { category });
    }

    return await query.getMany();
  }
}
