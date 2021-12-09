import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  code: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string;
}