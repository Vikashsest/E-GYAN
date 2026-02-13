// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// @Entity()
// export class Repositories {
//   @PrimaryGeneratedColumn()
//   id: number;
//   @Column()
//   type: string;
//   @Column()
//   text: string;
//   @Column({ nullable: true })
//   category: string;
// }

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Repositories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // subject / book / video (agar use ho raha hai)

  @Column()
  text: string; // title / name

  @Column({ nullable: true })
  category: string; // phd

  @Column({ name: 'education_level', nullable: true })
  educationLevel: string;

  @Column({ nullable: true })
  subject: string; // CS

  @Column({ nullable: true })
  book: string; // Java Complete Reference

  @Column({ nullable: true })
  language: string; // English

  @Column({ nullable: true })
  resourceType: string; // Book / PDF / Video
}
