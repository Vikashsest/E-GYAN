import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';
import { Chapter } from '../../book/entities/chapter.entity';

export enum AnalyticsType {
  BOOK_PROGRESS = 'BOOK_PROGRESS',
  RESOURCE_ACTIVITY = 'RESOURCE_ACTIVITY',
  STUDENT_ENGAGEMENT = 'STUDENT_ENGAGEMENT',
  SERVER_SYNC = 'SERVER_SYNC',
}

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  student: User;

  @ManyToOne(() => Book, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  book?: Book;

  @ManyToOne(() => Chapter, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  chapter?: Chapter;

  @Column({ type: 'enum', enum: AnalyticsType })
  type: AnalyticsType;

  @Column({ nullable: true })
  resourceTitle?: string;

  @Column({ type: 'int', default: 0 })
  timeSpent?: number;  // in seconds

  @Column({ type: 'float', nullable: true })
  progress?: number; // % progress of book

  @Column({ default: false })
  isCompleted?: boolean;

  @Column({ default: false })
  isFavorite?: boolean;

  @Column({ nullable: true })
  serverId?: string; 
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
