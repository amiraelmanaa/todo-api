import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import { TestModule } from './test/test.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/entities/todo.entity.js';
@Module({
  imports: [
  CommonModule,
  TestModule,

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'lina2022',
    database: 'todo_db',
    entities: [TodoEntity],
    synchronize: true,
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
