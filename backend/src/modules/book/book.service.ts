import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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


@Injectable()
export class BookService {
  
   constructor(
    @InjectRepository(Book)
    private readonly bookrepo: Repository<Book>,
    private readonly nextcloudService: NextcloudService,
    @InjectRepository(Chapter)
    private readonly chapterRepo:Repository<Chapter>,
     @InjectRepository(StudentActivity)
        private readonly studentActivityRepo: Repository<StudentActivity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
        @InjectRepository(Announcement)
        private readonly announcementRepo:Repository<Announcement>,
        @InjectRepository(Simulation)
    private readonly simulationRepo:Repository<Simulation>,
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
      uploadedAt: 'ASC' },
  });


  return books.map(book => {
    const sortedChapters = book.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
    const firstChapter = sortedChapters[0];
    return {
      ...book,
      thumbnail: firstChapter?.thumbnail || book.thumbnail || null,
      fileUrl: firstChapter?.fileUrl || book.fileUrl || null,
      thumbnailProxyUrl: book.thumbnail
        ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(book.thumbnail)}`
        : null,

      chapters: sortedChapters.map(chap => ({
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






async findByUploaderId(userId: number) {
  const books = await this.bookrepo.find({
    where: { uploadedBy: { id: userId } },
    relations: ['uploadedBy', 'chapters'],
    order: { uploadedAt: 'DESC' },
  });

  return books.map(book => {
    const sortedChapters = book.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
    const firstChapter = sortedChapters[0];
    return {
      ...book,
      thumbnail: firstChapter?.thumbnail || book.thumbnail || null,
      fileUrl: firstChapter?.fileUrl || book.fileUrl || null,
      chapters: sortedChapters.map(chap => ({
        id: chap.id,
        chapterNumber: chap.chapterNumber,
        fileUrl: chap.fileUrl,
        thumbnail: chap.thumbnail,
      })),
    };
  });
}



  async getDashboardStats() {
  const totalBooks = await this.bookrepo.count();
  const totalStudents = await this.userRepo.count({ where: { role: UserRole.STUDENT } });
  const totalTeachers=await this.userRepo.count({where:{role:UserRole.TEACHER}})
const booksPerSubject = await this.bookrepo
  .createQueryBuilder('book')
  .select('book.subject', 'subject')
  .addSelect('COUNT(*)', 'count')
  .where('book.subject IS NOT NULL')
  .groupBy('book.subject')
  .getRawMany();
const books = await this.bookrepo.find();
const subjectWiseUploads = {};

books.forEach(book => {
  const subject = book.subject;
  const month = book.uploadedAt.toLocaleString('default', { month: 'short' });

  if (!subjectWiseUploads[subject]) {
    subjectWiseUploads[subject] = [];
  }

  const monthEntry = subjectWiseUploads[subject].find(m => m.month === month);
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
  subjectWiseUploads
    };
  }

async getSubjects(className?: string) {
  let query = this.bookrepo.createQueryBuilder('book').select('book.subject');

  if (className) {
  query = query.where('TRIM(LOWER(book.educationLevel)) = TRIM(LOWER(:className))', { className });
}
const subjects = await query.getMany();
const uniqueSubjects = [...new Set(subjects.map((b) => b.subject?.trim()).filter(Boolean))];

  return uniqueSubjects;
}
async getBooks(filters: { className?: string; subject?: string; category?: string }) {
  const books = await this.bookrepo.find({
    relations: ['chapters'], 
    order: { uploadedAt: 'ASC' },
  });
  let filteredBooks = books;
  if (filters.className) {
    filteredBooks = filteredBooks.filter(
      b => b.educationLevel?.toLowerCase() === filters.className?.toLowerCase()
    );
  }
  if (filters.subject) {
    filteredBooks = filteredBooks.filter(
      b => b.subject?.toLowerCase() === filters.subject?.toLowerCase()
    );
  }
  if (filters.category) {
    filteredBooks = filteredBooks.filter(
      b => b.category?.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  return filteredBooks.map(book => {
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
      thumbnailProxyUrl: (firstChapterThumbnail || book.thumbnail)
        ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(firstChapterThumbnail || book.thumbnail)}`
        : null,
    };
  });
}


 
async findAllEducationLevels(): Promise<string[]> {
  const books = await this.bookrepo.find({
    select: ['educationLevel'], 
  });
  const levels = Array.from(new Set(books.map(b => b.educationLevel)));
  const sortedLevels = levels.sort((a, b) => {
    const numA = parseInt(a.replace('Class ', ''), 10);
    const numB = parseInt(b.replace('Class ', ''), 10);
    return numA - numB; 
  });

  return sortedLevels;
}
async remove(id: number) {
  return await this.bookrepo.delete(id);
}
  async getCategories(): Promise<string[]> {
    const categories = await this.bookrepo
      .createQueryBuilder("book")
      .select("DISTINCT book.category", "category")
      .where("book.category IS NOT NULL")
      .getRawMany();

    return categories.map((c) => c.category);
  }
async updateBook(id: number, updateBookDto: UpdateBookDto, file?: Express.Multer.File) {
  const book = await this.bookrepo.findOne({ where: { id } });
  if (!book) {
    throw new NotFoundException(`Book with ID ${id} not found`);
  }
  if (file) {
    updateBookDto.fileUrl = `uploads/${file.filename}`;
    updateBookDto.fileType = file.mimetype;
  }
  const updatedBook = Object.assign(book, updateBookDto);
  return this.bookrepo.save(updatedBook);
}
async getChaptersByBookId(bookId: number): Promise<any[]> {
  const chapters = await this.chapterRepo.find({
    where: { book: { id: bookId } },
    order: { chapterNumber: 'ASC' },
    select: ['id', 'chapterNumber', 'fileUrl', 'thumbnail', 'resourceType', 'totalPages'], 
  });

  return chapters.map(ch => ({
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
    select: ["id", "fileUrl"]
  });

  if (!chapter || !chapter.fileUrl) {
    throw new NotFoundException("File URL not found");
  }

  let fileUrl = chapter.fileUrl;
  if (fileUrl.includes("/index.php/s/") && !fileUrl.endsWith("/download")) {
    fileUrl = fileUrl.replace(/\/+$/, "") + "/download";
  }

  return fileUrl;
}

async deleteChapter(chapterId: number): Promise<{ message: string }> {
  try {
    const chapter = await this.chapterRepo.findOne({
      where: { id: chapterId },
      relations: ['book'],
    });
    if (!chapter) throw new NotFoundException(`Chapter with ID ${chapterId} not found`);

    // Step 1: Delete all student activities for this chapter
    await this.studentActivityRepo.delete({ chapter: { id: chapterId } });

    // Step 2: Remove chapter
    await this.chapterRepo.remove(chapter);

    return { message: `Chapter ${chapter.chapterNumber} of book "${chapter.book.bookName}" deleted successfully` };
  } catch (err) {
    console.error("Delete chapter error:", err);
    throw new InternalServerErrorException('Failed to delete chapter');
  }
}



async addChapter(
  bookId: number,
  // body: { chapterNumber: number; resourceType?: 'pdf' | 'video' | 'audio'; videoUrl?: string,  parentChapterId?: number; },
  body: { 
  chapterNumber: number; 
  resourceType?: 'pdf' | 'video' | 'audio' | 'simulation'; 
  videoUrl?: string;  
  parentChapterId?: number; 
},

  file?: Express.Multer.File,
  thumbnail?: Express.Multer.File,
) {
  const book = await this.bookrepo.findOne({ where: { id: bookId } });
  if (!book) throw new NotFoundException('Book not found');

  let fileUrl: string | undefined;
  let totalPages: number | undefined;
  let resourceType: 'pdf' | 'video' | 'audio' | 'simulation' = body.resourceType || 'pdf';

  if (resourceType === 'pdf') {
    if (!file) throw new BadRequestException('PDF file is required');
    const extension = file.originalname.split('.').pop()?.toLowerCase();
    const fileRemotePath = `books/${bookId}/chapters/chapter-${body.chapterNumber}.${extension}`;
    const uploadedFilePath = await this.nextcloudService.uploadFile(file.path, fileRemotePath);
    fileUrl = await generatePublicLink(uploadedFilePath);
    try {
      totalPages = await getPdfTotalPages(file.path);
    } catch (error) {
      console.error('Error reading PDF pages:', error);
    }
  } else if (resourceType === 'video') {
    if (!body.videoUrl) throw new BadRequestException('Video URL is required');
    fileUrl = body.videoUrl;
  } else if (resourceType === 'audio') {
    if (!file) throw new BadRequestException('Audio file is required');
    const extension = file.originalname.split('.').pop()?.toLowerCase();
    const fileRemotePath = `books/${bookId}/chapters/chapter-${body.chapterNumber}.${extension}`;
    const uploadedFilePath = await this.nextcloudService.uploadFile(file.path, fileRemotePath);
    fileUrl = await generatePublicLink(uploadedFilePath);
  }else if (resourceType === 'simulation') {
  if (!body.videoUrl) throw new BadRequestException('Simulation URL is required');
  fileUrl = body.videoUrl;
}else if (resourceType === 'simulation') {
    if (!body.videoUrl) throw new BadRequestException('Simulation URL is required');
    fileUrl = body.videoUrl;
  }
  // let thumbnailUrl: string | undefined;
  // if (thumbnail) {
  //   const thumbRemotePath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;
  //   const uploadedThumbPath = await this.nextcloudService.uploadFile(thumbnail.path, thumbRemotePath);
  //   thumbnailUrl = await generatePublicLink(uploadedThumbPath);
  // }
let thumbnailUrl: string | undefined;

if (thumbnail) {
  // Agar user ne thumbnail upload kiya
  const thumbRemotePath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;
  const uploadedThumbPath = await this.nextcloudService.uploadFile(thumbnail.path, thumbRemotePath);
  thumbnailUrl = await generatePublicLink(uploadedThumbPath);
} else {
  // Agar user ne upload nahi kiya, existing chapter ka thumbnail reuse karo
  const existingChapter = await this.chapterRepo.findOne({
    where: { chapterNumber: body.chapterNumber, book: { id: bookId } },
  });
  thumbnailUrl = existingChapter?.thumbnail;
}
 const parentChapter = body.parentChapterId
  ? (await this.chapterRepo.findOne({ where: { id: body.parentChapterId } })) ?? undefined
  : undefined;

  const chapter = this.chapterRepo.create({
    chapterNumber: body.chapterNumber,
    fileUrl,
    thumbnail: thumbnailUrl,
    totalPages,
    resourceType,
    book,
    parentChapter
  });

  return this.chapterRepo.save(chapter);
}


async getChaptersMeta(bookId: number) {
  const book = await this.bookrepo.findOne({ where: { id: bookId } });
  if (!book) throw new NotFoundException("Book not found");

  const chapters = await this.chapterRepo.find({
  where: { 
    book: { id: bookId },
    parentChapter: IsNull(), // ✅ only main chapters
  },
  relations: ['parts'], // include sub-chapters
  order: { chapterNumber: 'ASC', id: 'ASC' },
});

  // Map main chapters and their parts
 return chapters
  .filter(ch => !ch.parentChapter) // sirf top-level chapters
  .map(ch => ({
    id: ch.id,
    chapterNumber: ch.chapterNumber,
    chapterName: ch.chapterName,
    resourceType: ch.resourceType || 'pdf',
    totalPages: ch.totalPages,
    thumbnail: ch.thumbnail,
    thumbnailProxyUrl: ch.thumbnail ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(ch.thumbnail)}` : null,
    fileUrl: ch.fileUrl,
    proxyUrl: `${process.env.API_URL}/books/${bookId}/chapters/${ch.id}/file`,
    parts: ch.parts?.map(p => ({
      id: p.id,
      chapterNumber: p.chapterNumber,
      chapterName: p.chapterName,
      resourceType: p.resourceType || 'pdf',
      totalPages: p.totalPages,
      thumbnail: p.thumbnail,
      thumbnailProxyUrl: p.thumbnail ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(p.thumbnail)}` : null,
      fileUrl: p.fileUrl,
      proxyUrl: `${process.env.API_URL}/books/${bookId}/chapters/${p.id}/file`,
    })) || []
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

async fetechAllSimulations(){
  return await this.simulationRepo.find({
    order:{createdAt:'DESC'}
  });
}


}
