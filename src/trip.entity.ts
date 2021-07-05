/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destination: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.trips , {onDelete: 'SET NULL'})
  employeeId: number;
}
