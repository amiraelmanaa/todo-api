import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { StatusEnum } from '../enums/status.enums.js';

@Entity('todo')
export class TodoEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.TODO,
  })
  status!: StatusEnum;

  @UpdateDateColumn()
updatedAt!: Date;

@DeleteDateColumn()
deletedAt!: Date | null;
}