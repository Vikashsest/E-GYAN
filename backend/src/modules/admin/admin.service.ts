import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';
import { In, Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { ILike } from 'typeorm';
import { Concern } from '../student/entities/raise-concern.entity';
import { instanceToPlain } from 'class-transformer';
import { Student } from '../student/entities/student.entity';
import * as bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
import { NextcloudService } from '../nextcloud/nextcloud.service';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { Chapter } from '../book/entities/chapter.entity';
import { BookProgress } from '../book/entities/book-progress.entity';
import { StudentActivity, ActivityType } from '../student/entities/student-activity.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(Concern)
    private readonly concernRepo:Repository<Concern>,
    @InjectRepository(Student)
    private readonly studentRepo:Repository<Student>,
        @InjectRepository(BookProgress)
    private readonly progressRepo:Repository<BookProgress>,
    @InjectRepository(StudentActivity)
    private readonly studentActivityRepo:Repository<StudentActivity>,
    private readonly nextcloudService: NextcloudService,
  ) {}

  async getDashboardStats() {
  const totalBooks = await this.bookRepo.count();
  const totalPdf = await this.chapterRepo.count({ where: { resourceType: ILike('PDF') } });
  const totalVideos = await this.chapterRepo.count({ where: { resourceType: ILike('Video') } });
  const totalAudio = await this.chapterRepo.count({ where: { resourceType: ILike('Audio') } });
  const totalStudents = await this.userRepo.count({ where: { role: UserRole.STUDENT } });
     
    return {
      totalBooks,
      totalPdf,
      totalVideos,
      totalAudio,
      totalStudents,
    };
  }
  async getAllConcerns() {
  const concerns = await this.concernRepo
    .createQueryBuilder('concern')
    .leftJoinAndSelect('concern.student', 'student')
    .orderBy(`
      CASE 
        WHEN concern.status = 'resolved' THEN 0
        WHEN concern.status = 'pending' THEN 1
        WHEN concern.status = 'rejected' THEN 2
        ELSE 3
      END
    `)
    .addOrderBy('concern.id', 'DESC')
    .getMany();

  return instanceToPlain(concerns); 
}

async getSchoolOverview(){
  const totalBooks = await this.bookRepo.count();
  const totalTeachers=await this.userRepo.count({where:{role:UserRole.TEACHER}})
  const totalStudents=await this.userRepo.count({where:{role:UserRole.STUDENT}})
  const totalClasses = await this.studentRepo
    .createQueryBuilder('student')
    .select('COUNT(DISTINCT  student.className)', 'count')
    .getRawOne();
  return {
    totalBooks,totalTeachers,totalStudents,totalClasses: parseInt(totalClasses.count)
  }
}


// async importUsersFromFile(filePath: string) {
//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rawData = XLSX.utils.sheet_to_json(sheet);
//     const data = rawData.map((row: any) => {
//       const normalized: any = {};
//       Object.keys(row).forEach((key) => {
//         normalized[key.toLowerCase()] = row[key];
//       });
//       return normalized;
//     });

//     console.log('Parsed Excel Data:', data);

//     const usersToInsert: User[] = [];

//     for (const row of data) {
//       const r = row as {
//         name?: string;
//         email?: string;
//         password?: string;
//         role?: string;
//         subject?: string;
//         dob?: string;
//         isactive?: boolean;
//       };

//       const { name, email, password, role, subject, dob, isactive } = r;

//       if (!email || !password || !name || !role) continue;

//       const hashedPassword = await bcrypt.hash(password.toString(), 10);

//   const user: User = this.userRepo.create({
//   name: name!,
//   email: email!,
//   password: hashedPassword,
//   role: role!.toLowerCase() as any, 
//   subject: subject || null,
//   dob: dob ? new Date(dob) : null,
//   isActive: isactive !== undefined ? Boolean(isactive) : true,
// });

//       usersToInsert.push(user);
//     }

//     if (usersToInsert.length === 0) {
//       throw new BadRequestException('No valid users found in the file');
//     }

//     try {
//       await this.userRepo.save(usersToInsert);
//       console.log('Inserted users into DB:', usersToInsert.length);
//     } catch (error) {
//       console.error('Error saving users:', error);
//       throw new BadRequestException('Failed to save users to DB');
//     }

//     return { message: `${usersToInsert.length} users uploaded successfully` };
//   }


async importUsersFromFile(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(sheet);


  const data = rawData.map((row: any) => {
    const normalized: any = {};
    Object.keys(row).forEach((key) => {
      if (key) {
        normalized[key.toLowerCase().trim()] = row[key];
      }
    });
    return normalized;
  });

  console.log('Parsed Excel Data:', data);

  const usersToInsert: User[] = [];
  const skippedRows: any[] = [];

  const validRoles = ["admin", "teacher", "student"];

  for (const row of data) {
    const r = row as {
      username?: string;
      password?: string;
      role?: string;
      subject?: string;
      dob?: string;
      isactive?: boolean | string | number;
    };

    let { username, password, role, subject, dob, isactive } = r;

    if (  !password || !username || !role) {
      skippedRows.push({ row, reason: "Missing required field" });
      continue;
    }

    // Convert to lowercase + trim
    username = username.toString().trim();
    // email = email.toString().trim().toLowerCase();
    role = role.toString().trim().toLowerCase();
    // subject = subject ? subject.toString().trim() : null;

    if (!validRoles.includes(role)) {
      skippedRows.push({ row, reason: "Invalid role" });
      continue;
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // DOB conversion
    let dobDate: Date | null = null;
    if (dob) {
      const tempDate = new Date(dob);
      dobDate = isNaN(tempDate.getTime()) ? null : tempDate;
    }

    // isActive conversion
    const isActiveVal =
      isactive === true ||
      isactive === "TRUE" ||
      isactive === 1 ||
      isactive === "1"
        ? true
        : false;

    const user: User = this.userRepo.create({
      username,
      email: `${username}@example.com`,
      password: hashedPassword,
      role: role as any,
      subject,
      dob: dobDate,
      isActive: isactive !== undefined ? isActiveVal : true,
    });

    usersToInsert.push(user);
  }

  if (usersToInsert.length === 0) {
    throw new BadRequestException('No valid users found in the file');
  }

  try {
    await this.userRepo.save(usersToInsert);
    console.log('Inserted users into DB:', usersToInsert.length);
  } catch (error) {
    console.error('Error saving users:', error);
    throw new BadRequestException('Failed to save users to DB');
  }

  try {
    await unlink(filePath);
    console.log('Temporary file deleted:', filePath);
  } catch (err) {
    console.warn('Failed to delete local file:', err);
  }

  return {
    message: `${usersToInsert.length} users uploaded successfully`,
    skipped: skippedRows.length,
    skippedRows,
  };
}


async studentProgress() {
  // 1️⃣ Pehle saare students lao
  const students = await this.userRepo.find({
    where: { role: UserRole.STUDENT },
    select: ['id', 'username'],
  });

  if (!students.length) return [];

  const studentIds = students.map((s) => s.id);

  // 2️⃣ Saare student activities lao (sirf completed)
  const allActivities = await this.studentActivityRepo.find({
    where: { user: { id: In(studentIds) }, activityType: ActivityType.COMPLETED },
     relations: ['book', 'user'],
    select: {
      id: true,
      isCompleted: true,
      book: { id: true, bookName: true },
      user: { id: true },
    },
  });

  // 3️⃣ Har student ka progress calculate karo
  const result = await Promise.all(
    students.map(async (s) => {
      // Student ke completed activities nikaalo
      const userActivities = allActivities.filter((a) => a.user.id === s.id);

      // Group by book
      const booksMap: Record<string, number> = {};
      for (const act of userActivities) {
        const bookId = act.book?.id;
        if (!bookId) continue;
        booksMap[bookId] = (booksMap[bookId] || 0) + 1;
      }

      // 4️⃣ Har book ke total chapters count karo
      const progressByBook = await Promise.all(
        Object.keys(booksMap).map(async (bookId) => {
          const totalChapters = await this.chapterRepo.count({
            where: { book: { id: +bookId } },
          });
          const completed = booksMap[bookId];
          const progress = totalChapters
            ? Math.round((completed / totalChapters) * 100)
            : 0;

          const book = userActivities.find((a) => a.book?.id === +bookId)?.book;

          return {
            bookName: book?.bookName || 'Unknown Book',
            progress,
          };
        }),
      );

      // 5️⃣ Average progress nikalo
      const averageProgress =
        progressByBook.length > 0
          ? Math.round(
              progressByBook.reduce((sum, b) => sum + b.progress, 0) /
                progressByBook.length,
            )
          : 0;

      return {
        id: s.id,
        username: s.username,
        email: s.email,
        progressByBook,
        averageProgress,
      };
    }),
  );

  return result;
}



}
