import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Repositories {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: string;
  @Column()
  text: string;
}
