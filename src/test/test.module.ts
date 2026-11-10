import { Module } from '@nestjs/common';
import { TestService } from './test.service.js';

@Module({
  providers: [TestService],
})
export class TestModule {}