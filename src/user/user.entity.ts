
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { TodoEntity } from '../todo/entities/todo.entity.js';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  // Un utilisateur peut posséder plusieurs Todos
  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos!: TodoEntity[];
}
