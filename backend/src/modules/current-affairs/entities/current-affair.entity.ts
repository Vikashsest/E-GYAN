import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class CurrentAffair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string; 

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;
}
