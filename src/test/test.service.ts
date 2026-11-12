import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class TestService {

  constructor(
    @Inject('UUID_GENERATOR')
    private readonly uuidGenerator: () => string,
  ) {}    //uuidGenerator contient maintenant la fonction uuidv4

  generateId(): string {
    return this.uuidGenerator();
  }
}