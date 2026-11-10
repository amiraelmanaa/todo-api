import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity.js';
import { TodoService } from './todo.service.js';
import { TodoController } from './todo.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodoService],
  exports: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}