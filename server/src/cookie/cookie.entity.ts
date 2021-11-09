import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cookie {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  user_code: string;
  
  @Column()
  jd: string;

  @Column()
  juejin: string;
}