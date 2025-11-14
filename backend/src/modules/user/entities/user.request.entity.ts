import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/modules/user/entities/user.entity";

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.requests, { onDelete: "CASCADE" })
  user: User;
}
