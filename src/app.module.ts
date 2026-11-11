import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import { TestModule } from './test/test.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/entities/todo.entity.js';
import { TodoModule } from './todo/todo.module.js';
import { UserModule } from './user/user.module.js';
import { UserEntity } from './user/user.entity.js';



@Module({
  imports: [
  CommonModule,
  TestModule,
  UserModule,

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'lina2022',
    database: 'todo_db',
    entities: [TodoEntity,UserEntity],
    synchronize: true,
  }),

  TodoModule,

  UserModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
