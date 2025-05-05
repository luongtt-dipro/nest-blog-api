import { Module } from '@nestjs/common';
import { FakeLoginController } from './fake-login.controller';
import { FakeLoginService } from './fake-login.service';

@Module({
  controllers: [FakeLoginController],
  providers: [FakeLoginService],
})
export class FakeLoginModule {}
