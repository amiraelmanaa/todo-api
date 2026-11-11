import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Rechercher un utilisateur par son identifiant
  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  // Créer un utilisateur de test
  create(username: string) {
    const user = this.userRepository.create({ username });
    return this.userRepository.save(user);
  }
}