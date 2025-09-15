import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ILike, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/entities/user.entity'; 
import { Announcement } from '../student/entities/announcement.entity';
import getPdfTotalPages from 'src/common/utils/Helper/pdf.parse';
import { Chapter } from './entities/chapter.entity';
import { NextcloudService } from '../nextcloud/nextcloud.service';
import { generatePublicLink } from 'src/common/utils/nextcloud.config';
import { StudentActivity } from '../student/entities/student-activity.entity';



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
        private readonly announcementRepo:Repository<Announcement>
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


async findAllEducationLevels(): Promise<string[]> {
  const books = await this.bookrepo.find({
    select: ['educationLevel'], // sirf educationLevel fetch hoga
  });

  // Unique education levels nikalna
  const levels = Array.from(new Set(books.map(b => b.educationLevel)));

  // Sort karna numeric order mein
  const sortedLevels = levels.sort((a, b) => {
    const numA = parseInt(a.replace('Class ', ''), 10);
    const numB = parseInt(b.replace('Class ', ''), 10);
    return numA - numB; // Ascending
  });

  return sortedLevels;
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


 




async remove(id: number) {
  return await this.bookrepo.delete(id);
}
// async getBooksByCategory(category: string) {
//   return this.bookrepo.find({
//     where: { category },
//     select: [
//       'id',
//       'bookName',
//       'subject',
//       'educationLevel',
//       'language',
//       'stateBoard',
//       // 'resourceType',
//       'fileUrl',
//       'thumbnail',
//       'uploadedAt',
//     ],
//     order: { uploadedAt: 'DESC' },
//   });
// }

// async getFilteredBooks(query: any) {
//   const {
//     subject,
//     educationLevel,
//     language,
//     type,
//     board,
//     category,
//     class: className,  

//     bookName,
//   } = query;

//   const where: any = {};

//   if (subject) where.subject = subject;
//   if (educationLevel) where.educationLevel = educationLevel;
//   if (language) where.language = language;
//   if (type) where.type = type;
//   if (board) where.board = board;
//   if (category) where.category = category;
//   if (className) where.class = className;
//   if (bookName) {
//     where.title = ILike(`%${bookName}%`);
//   }

//   return this.bookrepo.find({ where });
// }

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


// async getChaptersByBookId(bookId: number): Promise<any[]> {
//   const book = await this.bookrepo.findOne({ where: { id: bookId } });
//   if (!book) throw new NotFoundException('Book not found');

//   const chapters = await this.chapterRepo.find({
//     where: { book: { id: bookId } },
//     order: { chapterNumber: 'ASC' },
//   });


//   // return chapters.map(ch => ({
//   //   id: ch.id,
//   //   chapterNumber: ch.chapterNumber,
//   //   fileUrl: ch.fileUrl,
//   //   proxyUrl: `${process.env.API_URL}/books/proxy/file?url=${encodeURIComponent(ch.fileUrl)}`,
//   //   thumbnail: ch.thumbnail,
//   //   thumbnailProxyUrl: ch.thumbnail
//   //     ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(ch.thumbnail)}`
//   //     : null,
//   //   // resourceType: chapters.resourceType,
//   // }));
//   return chapters.map(ch => ({
//   id: ch.id,
//   chapterNumber: ch.chapterNumber,
//   fileUrl: ch.fileUrl,
//   proxyUrl: `${process.env.API_URL}/books/proxy/file?url=${encodeURIComponent(ch.fileUrl)}`,
//   thumbnail: ch.thumbnail,
//   thumbnailProxyUrl: ch.thumbnail
//     ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(ch.thumbnail)}`
//     : null,
//   resourceType: ch.resourceType || 'pdf', // ✅ add resourceType, default pdf
// totalPages:ch.totalPages,
// }));

// }

async getChaptersByBookId(bookId: number): Promise<any[]> {
  // foreign key indexed hai, so this will be faster now
  const chapters = await this.chapterRepo.find({
    where: { book: { id: bookId } },
    order: { chapterNumber: 'ASC' },
    select: ['id', 'chapterNumber', 'fileUrl', 'thumbnail', 'resourceType', 'totalPages'], // only required fields
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


// async getChapterFileStream(bookId: number, chapterId: number) {
//   const chapter = await this.chapterRepo.findOne({
//     where: { id: chapterId, book: { id: bookId } },
//   });
//   console.log("chapter is",chapter)
// let fileUrl = chapter?.fileUrl;
// if (!fileUrl) {
//   throw new NotFoundException("File URL not found");
// }
//  if (fileUrl.includes("/index.php/s/") && !fileUrl.endsWith("/download")) {
//     fileUrl = fileUrl.replace(/\/+$/, "") + "/download";
//   }
// return fileUrl; 
// }
async getChapterFileStream(bookId: number, chapterId: number) {
  const chapter = await this.chapterRepo.findOne({
    where: { id: chapterId, book: { id: bookId } },
    select: ["id", "fileUrl"] // ✅ sirf fileUrl fetch karo
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





// async addChapter(
//   bookId: number,
//   body: { chapterNumber: number },
//   file?: Express.Multer.File,
//   thumbnail?: Express.Multer.File,
// ): Promise<any> {
//   const book = await this.bookrepo.findOne({ where: { id: bookId } });
//   if (!book) throw new NotFoundException('Book not found');

//   if (!file) throw new BadRequestException('Chapter PDF file is required');
//   if (!thumbnail) throw new BadRequestException('Chapter thumbnail is required');

//   let fileUrl: string;
//   let thumbnailUrl: string;
//   let totalPages: number | undefined;
//   const pdfRemotePath = `books/${bookId}/chapters/chapter-${body.chapterNumber}.pdf`;
//   const uploadedPdfPath = await this.nextcloudService.uploadFile(file.path, pdfRemotePath);
//   fileUrl = await generatePublicLink(uploadedPdfPath);
//   try {
//     totalPages = await getPdfTotalPages(file.path);
//   } catch (error) {
//     console.error('Error reading PDF pages:', error);
//   }

//   const thumbRemotePath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;


// const uploadedThumbPath = await this.nextcloudService.uploadFile(thumbnail.path, thumbRemotePath);
// thumbnailUrl = await generatePublicLink(uploadedThumbPath);

//   const chapter = this.chapterRepo.create({
//     chapterNumber: body.chapterNumber,
//     fileUrl,
//     thumbnail: thumbnailUrl,
//     totalPages,
//     book,
//   });

//   return this.chapterRepo.save(chapter);
// }



// async addChapter(bookId: number, body: { chapterNumber: number }, file?: Express.Multer.File, thumbnail?: Express.Multer.File) {
//   const book = await this.bookrepo.findOne({ where: { id: bookId } });
//   if (!book) throw new NotFoundException('Book not found');
//   if (!file) throw new BadRequestException('Chapter PDF file is required');
//   if (!thumbnail) throw new BadRequestException('Chapter thumbnail is required');

//   const pdfRemotePath = `books/${bookId}/chapters/chapter-${body.chapterNumber}.pdf`;
//   const thumbRemotePath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;
//   const [uploadedPdfPath, uploadedThumbPath] = await Promise.all([
//     this.nextcloudService.uploadFile(file.path, pdfRemotePath),
//     this.nextcloudService.uploadFile(thumbnail.path, thumbRemotePath),
//   ]);
//   const [fileUrl, thumbnailUrl] = await Promise.all([
//     generatePublicLink(uploadedPdfPath),
//     generatePublicLink(uploadedThumbPath),
//   ]);

//   let totalPages: number | undefined;
//   try {
//     totalPages = await getPdfTotalPages(file.path);
//   } catch (error) {
//     console.error('Error reading PDF pages:', error);
//   }

//   const chapter = this.chapterRepo.create({
//     chapterNumber: body.chapterNumber,
//     fileUrl,
//     thumbnail: thumbnailUrl,
//     totalPages,
//     book,
//   });

//   return this.chapterRepo.save(chapter);
// }


//deplyed
// async addChapter(
//   bookId: number,
//   body: { chapterNumber: number ,resourceType?: 'pdf' | 'video' | 'audio'},
//   file?: Express.Multer.File,
//   thumbnail?: Express.Multer.File,
// ) {
//   const book = await this.bookrepo.findOne({ where: { id: bookId } });
//   if (!book) throw new NotFoundException('Book not found');
//   if (!file) throw new BadRequestException('Chapter file is required');

 
//   const extension = file.originalname.split('.').pop()?.toLowerCase();
//   let fileRemotePath = `books/${bookId}/chapters/chapter-${body.chapterNumber}.${extension}`;
//   let thumbRemotePath: string | undefined;
//   if (thumbnail) {
//     thumbRemotePath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;
//   }

//   const uploadedFilePath = await this.nextcloudService.uploadFile(file.path, fileRemotePath);
//   const fileUrl = await generatePublicLink(uploadedFilePath);

//   let thumbnailUrl: string | undefined;
//   if (thumbnail) {
//     const uploadedThumbPath = await this.nextcloudService.uploadFile(thumbnail.path, thumbRemotePath!);
//     thumbnailUrl = await generatePublicLink(uploadedThumbPath);
//   }

//   let totalPages: number | undefined;
//   if (extension === 'pdf') {
//     try {
//       totalPages = await getPdfTotalPages(file.path);
//     } catch (error) {
//       console.error('Error reading PDF pages:', error);
//     }
//   }


// let resourceType: 'pdf' | 'video' | 'audio' = 'pdf';
// if (extension === 'mp4' || extension === 'mov' || extension === 'mkv') resourceType = 'video';
// else if (extension === 'mp3' || extension === 'wav') resourceType = 'audio';

// const chapter = this.chapterRepo.create({
//   chapterNumber: body.chapterNumber,
//   fileUrl,
//   thumbnail: thumbnailUrl,
//   totalPages,
//   resourceType, 
//   book,
// });


//   return this.chapterRepo.save(chapter);
// }

async addChapter(
  bookId: number,
  body: { chapterNumber: number; resourceType?: 'pdf' | 'video' | 'audio'; videoUrl?: string },
  file?: Express.Multer.File,
  thumbnail?: Express.Multer.File,
) {
  const book = await this.bookrepo.findOne({ where: { id: bookId } });
  if (!book) throw new NotFoundException('Book not found');

  let fileUrl: string | undefined;
  let totalPages: number | undefined;
  let resourceType: 'pdf' | 'video' | 'audio' = body.resourceType || 'pdf';

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
  }
  let thumbnailUrl: string | undefined;
  if (thumbnail) {
    const thumbRemotePath = `books/${bookId}/chapters/thumbnails/chapter-${body.chapterNumber}.jpg`;
    const uploadedThumbPath = await this.nextcloudService.uploadFile(thumbnail.path, thumbRemotePath);
    thumbnailUrl = await generatePublicLink(uploadedThumbPath);
  }

  const chapter = this.chapterRepo.create({
    chapterNumber: body.chapterNumber,
    fileUrl,
    thumbnail: thumbnailUrl,
    totalPages,
    resourceType,
    book,
  });

  return this.chapterRepo.save(chapter);
}


async getChaptersMeta(bookId: number) {
  // Fetch the book first
  const book = await this.bookrepo.findOne({ where: { id: bookId } });
  if (!book) throw new NotFoundException("Book not found");

  // Fetch all chapters of the book, ordered by chapterNumber
  const chapters = await this.chapterRepo.find({
    where: { book: { id: bookId } },
    order: { chapterNumber: "ASC" },
  });

  // Map chapter data to a clean response object
  return chapters.map((ch) => ({
    id: ch.id,
    chapterNumber: ch.chapterNumber,
    resourceType: ch.resourceType || "pdf",
    totalPages: ch.totalPages,
    thumbnail: ch.thumbnail,
    thumbnailProxyUrl: ch.thumbnail
      ? `${process.env.API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(ch.thumbnail)}`
      : null,
    fileUrl: ch.fileUrl, // ✅ Added
    proxyUrl: `${process.env.API_URL}/books/${bookId}/chapters/${ch.id}/file`, // Proxy access URL
  }));
}



}
