import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { StatusEnum } from '../enums/status.enums.js';
import { BaseTimeEntity } from '../../common/entities/base-time.entity.js';

import {
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from '../../user/user.entity.js';

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

  // Chaque Todo appartient à un seul utilisateur
@ManyToOne(() => UserEntity, (user) => user.todos, {
  nullable: true,  //car on a déjà des Todos enregistrées dans PostgreSQL qui n'ont pas encore de propriétaire
})
@JoinColumn({ name: 'userId' })
user!: UserEntity;
}