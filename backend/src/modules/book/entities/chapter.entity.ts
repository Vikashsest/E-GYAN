import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Book } from './book.entity';
import { StudentActivity } from 'src/modules/student/entities/student-activity.entity';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  chapterName: string;

  @Column({ nullable: true })
  chapterNumber: number;
  @Column({ nullable: true, type: 'int' })
  totalPages: number;
  @OneToMany(() => StudentActivity, (activity) => activity.chapter)
  activities: StudentActivity[];
  @Column({ nullable: false, default: 'pdf' })
  resourceType: string;

  @Column({ nullable: true })
  fileUrl: string;
  @Column({ nullable: true })
  thumbnail: string;
  @ManyToOne(() => Book, (book) => book.chapters, { onDelete: 'CASCADE' })
  @Index()
  book: Book;
  // @ManyToOne(() => Chapter, (chapter) => chapter.parts, { nullable: true })
  // parentChapter?: Chapter;

  // @OneToMany(() => Chapter, (chapter) => chapter.parentChapter)
  // parts?: Chapter[];
  @ManyToOne(() => Chapter, (chapter) => chapter.parts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parentChapter: Chapter | null;

  @OneToMany(() => Chapter, (chapter) => chapter.parentChapter)
  parts: Chapter[];

  @CreateDateColumn()
  createdAt: Date;
}
