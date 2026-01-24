import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Book } from 'src/modules/book/entities/book.entity';

type ReportItem = {
  student: string;
  bookName: string;
  language: string | null;
  educationLevel: string | null;
  subject: string | null;
  uploadedAt: Date;
  status: string;
};

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async getReport(filters: any): Promise<ReportItem[]> {
    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.books', 'book');

    if (filters.language) {
      query.andWhere('book.language = :language', {
        language: filters.language,
      });
    }
    if (filters.educationLevel) {
      query.andWhere('book.educationLevel = :educationLevel', {
        educationLevel: filters.educationLevel,
      });
    }
    if (filters.subject) {
      query.andWhere('book.subject = :subject', { subject: filters.subject });
    }
    if (filters.dateFrom) {
      query.andWhere('book.uploadedAt >= :dateFrom', {
        dateFrom: filters.dateFrom,
      });
    }
    if (filters.dateTo) {
      query.andWhere('book.uploadedAt <= :dateTo', { dateTo: filters.dateTo });
    }

    const users = await query.getMany();

    const data: ReportItem[] = [];

    users.forEach((user) => {
      user.books.forEach((book) => {
        data.push({
          student: user.username ?? user.email ?? 'Unknown',
          bookName: book.bookName,
          language: book.language ?? null,
          educationLevel: book.educationLevel ?? null,
          subject: book.subject ?? null,
          uploadedAt: book.uploadedAt,
          status: 'Active',
        });
      });
    });

    return data;
  }

  async getStats() {
    const totalBooks = await this.bookRepo.count();
    const totalUsers = await this.userRepo.count({ where: { isActive: true } });

    return {
      totalBooksCompleted: totalBooks,
      activeStudents: totalUsers,
      pendingReviews: 0,
    };
  }

  async exportCSV(filters: any) {
    const data = await this.getReport(filters);
    const header =
      'Student,Book Name,Language,Education Level,Subject,Uploaded At,Status\n';
    const rows = data
      .map(
        (d) =>
          `${d.student},${d.bookName},${d.language},${d.educationLevel},${d.subject},${d.uploadedAt.toISOString()},${d.status}`,
      )
      .join('\n');
    return header + rows;
  }
  async exportPDF() {
    return 'PDF generation — template ready 🙂';
  }
}
