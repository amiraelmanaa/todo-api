import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoEntity } from './entities/todo.entity.js';
import { TodoController } from './todo.controller.js';
import { TodoService } from './todo.service.js';
import { UserModule } from '../user/user.module.js';
import { AuthMiddleware } from '../common/middlewares/auth.middleware.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    UserModule,

  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(TodoController);
  }
}