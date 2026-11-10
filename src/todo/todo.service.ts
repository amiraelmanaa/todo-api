import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TodoEntity } from './entities/todo.entity.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { StatusEnum } from './enums/status.enums.js';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

async addTodoV1(dto: CreateTodoDto) {
  return await this.todoRepository.save(dto);
  //On transmet directement les données au repository pour les enregistrer
}

async addTodoV2(dto: CreateTodoDto) {
  const todo = this.todoRepository.create(dto);

  return await this.todoRepository.save(todo);
}

async updateTodo(id: number, dto: UpdateTodoDto) {
  const todo = await this.todoRepository.findOneBy({ id });

  if (!todo) {
    throw new NotFoundException(`Todo avec id ${id} introuvable`);
  }

  Object.assign(todo, dto);

  return await this.todoRepository.save(todo);
}
async deleteTodo(id: number) {
  const todo = await this.todoRepository.findOneBy({ id });

  if (!todo) {
    throw new NotFoundException(`Todo ${id} introuvable`);
  }

  await this.todoRepository.remove(todo);

  return { message: 'Todo supprimé avec succès' };
}


async softDeleteTodo(id: number) {
  const result = await this.todoRepository.softDelete(id);

  if (result.affected === 0) {
    throw new NotFoundException(`Todo ${id} introuvable`);
  }

  return { message: 'Todo supprimé temporairement' };
}

async restoreTodo(id: number) {
  const result = await this.todoRepository.restore(id);

  if (result.affected === 0) {
    throw new NotFoundException(`Todo ${id} introuvable ou non supprimé`);
  }

  return { message: 'Todo restauré avec succès' };
}

//obtenir le nombre de tâches dans chacun des trois statuts avec un seul appel HTTP
async countTodosByStatus() {
  const counts = await this.todoRepository
    .createQueryBuilder('todo')
    .select('todo.status', 'status')
    .addSelect('COUNT(todo.id)', 'count')
    .groupBy('todo.status')
    .getRawMany();

  return {
    TODO: Number(counts.find(c => c.status === StatusEnum.TODO)?.count ?? 0),
    IN_PROGRESS: Number(counts.find(c => c.status === StatusEnum.IN_PROGRESS)?.count ?? 0),
    DONE: Number(counts.find(c => c.status === StatusEnum.DONE)?.count ?? 0),
  };
}


async getAll(page: number, limit: number) {
  const [todos, total] = await this.todoRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: {
      id: 'ASC',
    },
  });

  return {
    data: todos,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async getTodoById(id: number) {
  const todo = await this.todoRepository.findOneBy({ id });

  if (!todo) {
    throw new NotFoundException(`Todo ${id} introuvable`);
  }

  return todo;
}


async searchTodos(search?: string, status?: StatusEnum) {
  const query = this.todoRepository.createQueryBuilder('todo');

  if (search) {
    query.andWhere(
      '(todo.name ILIKE :search OR todo.description ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  if (status) {
    query.andWhere('todo.status = :status', { status });
  }

  return await query.getMany();
}
}