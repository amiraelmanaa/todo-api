import {
  Controller,
  Post,
  Body,
  Version,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';

import { TodoService } from './todo.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import {
  Patch,
  Delete,
  Param,
  Put,
  Get,
  ParseIntPipe,
} from '@nestjs/common';

import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { StatusEnum } from './enums/status.enums.js';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
  ) {}

  @Post()
  @Version('1')
  addTodoV1(@Body() dto: CreateTodoDto) {
    return this.todoService.addTodoV1(dto);
  }

  @Post()
  @Version('2')
  addTodoV2(@Body() dto: CreateTodoDto) {
    return this.todoService.addTodoV2(dto);
 }
 @Patch(':id')
@Version('1')
updateTodo(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateTodoDto,
) {
  return this.todoService.updateTodo(id, dto);
}

@Delete(':id')
@Version('1')
deleteTodo(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.todoService.deleteTodo(id);
}

@Patch(':id/soft-delete')
@Version('1')
softDeleteTodo(@Param('id', ParseIntPipe) id: number) {
  return this.todoService.softDeleteTodo(id);
}

@Patch(':id/restore')
@Version('1')
restoreTodo(@Param('id', ParseIntPipe) id: number) {
  return this.todoService.restoreTodo(id);
}




@Get('stats/count-by-status')
@Version('1')
countTodosByStatus() {
  return this.todoService.countTodosByStatus();
}


@Get()
@Version('1')
getAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe)
  page: number,

  @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
  limit: number,
) {
  return this.todoService.getAll(page, limit);
}

@Get('search')
@Version('1')
searchTodos(
  @Query('search') search?: string,
  @Query('status') status?: StatusEnum,
) {
  return this.todoService.searchTodos(search, status);
}

@Get(':id')
@Version('1')
getTodoById(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.todoService.getTodoById(id);
}


}

