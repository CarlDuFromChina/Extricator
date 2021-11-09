import { Cookie } from "src/cookie/cookie.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  code: string;

  @Column()
  password: string;

  @OneToOne(() => Cookie)
  @JoinColumn()
  cookie: Cookie
}