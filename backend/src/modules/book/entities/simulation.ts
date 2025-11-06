import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Simulation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  topic: string;

  @Column()
  grade: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
