import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { StatusEnum } from '../enums/status.enums.js';
import { BaseTimeEntity } from '../../common/entities/base-time.entity.js';

@Entity('todo')
export class TodoEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.TODO,
  })
  status!: StatusEnum;
}