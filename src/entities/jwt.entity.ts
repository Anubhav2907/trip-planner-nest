/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JWT extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jwttoken: string;
}
