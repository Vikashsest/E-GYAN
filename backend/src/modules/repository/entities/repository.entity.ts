import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity() 
export class Repositories {
     @PrimaryGeneratedColumn()
     id: number;
     @Column()
     Subjects:string
     @Column()
     EducationLevels:string
     @Column()
     Languages:string
     @Column()
     Categories:string
     @Column()
     ResourceTypes:string
}

