
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TodoEntity } from './entities/todo.entity.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { StatusEnum } from './enums/status.enums.js';

import { UserService } from '../user/user.service.js';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,

    private readonly userService: UserService,
  ) {}

  // Vérifier que l'utilisateur existe et récupérer son entité
  //Parce qu'un JWT peut être correctement signé sans que son userId corresponde à un utilisateur existant dans notre base de donnée
  
  private async getUser(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    }

    return user;
  }

  // Récupérer un Todo et vérifier qu'il appartient à l'utilisateur
  private async getTodoOwnedByUser(id: number, userId: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: { user: true },
      withDeleted: true, // permet de récupérer également les Todos supprimés temporairement
    });

    if (!todo) {
      throw new NotFoundException(`Todo ${id} introuvable`); //404
    }

    if (!todo.user || todo.user.id !== userId) {
      throw new ForbiddenException(
        'Accès refusé : ce Todo ne vous appartient pas',
      );
    }

    return todo;
  }

 
  // CREATE

  async addTodoV1(dto: CreateTodoDto, userId: number) {
    const user = await this.getUser(userId);

    // Ancienne version :
    // return await this.todoRepository.save(dto);

    // Nouvelle version : on associe le Todo à son créateur
    return await this.todoRepository.save({
      ...dto,
      user,
    });
  }

  async addTodoV2(dto: CreateTodoDto, userId: number) {
    const user = await this.getUser(userId);

    // Ancienne version :
    // const todo = this.todoRepository.create(dto);
    // return await this.todoRepository.save(todo);

    // Nouvelle version : création avec association de l'utilisateur
    const todo = this.todoRepository.create({
      ...dto,
      user,
    });

    return await this.todoRepository.save(todo);
  }

 
  // UPDATE

  async updateTodo(id: number, dto: UpdateTodoDto, userId: number) {

    // Ancienne version :
    // const todo = await this.todoRepository.findOneBy({ id });
    // if (!todo) {
    //   throw new NotFoundException(`Todo avec id ${id} introuvable`);
    // }
    // Object.assign(todo, dto);
    // return await this.todoRepository.save(todo);

    // Nouvelle version : vérifier le propriétaire

    const todo = await this.getTodoOwnedByUser(id, userId);

    Object.assign(todo, dto);

    return await this.todoRepository.save(todo);
  }

 
  // DELETE DEFINITIF
  

  async deleteTodo(id: number, userId: number) {

    // Ancienne version :
    // const todo = await this.todoRepository.findOneBy({ id });
    // if (!todo) {
    //   throw new NotFoundException(`Todo ${id} introuvable`);
    // }
    // await this.todoRepository.remove(todo);

    // Nouvelle version : vérifier le propriétaire avant suppression
    
    const todo = await this.getTodoOwnedByUser(id, userId);

    await this.todoRepository.remove(todo);

    return { message: 'Todo supprimé avec succès' };
  }

  
  // SOFT DELETE

  async softDeleteTodo(id: number, userId: number) {

    // Ancienne version :
    // const result = await this.todoRepository.softDelete(id);
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Todo ${id} introuvable`);
    // }

    // Nouvelle version : vérifier le propriétaire
    const todo = await this.getTodoOwnedByUser(id, userId);

    if (todo.deletedAt) {
      throw new NotFoundException(`Todo ${id} est déjà supprimé`);
    }

    await this.todoRepository.softDelete(id);

    return { message: 'Todo supprimé temporairement' };
  }

 
  // RESTORE
  

  async restoreTodo(id: number, userId: number) {

    // Ancienne version :
    // const result = await this.todoRepository.restore(id);
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Todo ${id} introuvable ou non supprimé`);
    // }

    // Nouvelle version : vérifier le propriétaire, même si le Todo est supprimé
    const todo = await this.getTodoOwnedByUser(id, userId);

    if (!todo.deletedAt) {
      throw new NotFoundException(`Todo ${id} n'est pas supprimé`);
    }

    await this.todoRepository.restore(id);

    return { message: 'Todo restauré avec succès' };
  }

  
  // STATISTICS
 
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

 
  // PAGINATION

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

 
  // GET BY ID
 

  async getTodoById(id: number) {
    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException(`Todo ${id} introuvable`);
    }

    return todo;
  }

  // =========================
  // SEARCH
  // =========================

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
