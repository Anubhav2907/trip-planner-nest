/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  Email: string;

  @Column({ nullable: true })
  Password: string;

  @Column({ nullable: true })
  Role: string;

  @OneToMany(() => Trip, (trip) => trip.employeeId)
  trips: Trip[];
}
