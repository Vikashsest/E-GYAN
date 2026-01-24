import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Chapter } from '../../book/entities/chapter.entity';

@Entity()
export class ChapterEmbedding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  chapter: Chapter;

  @Column({
    type: 'vector' as unknown as 'float8', // workaround TypeScript
    length: 1536,
  })
  embedding: number[];

  @Column({ type: 'text' })
  chunkText: string;

  @CreateDateColumn()
  createdAt: Date;
}
