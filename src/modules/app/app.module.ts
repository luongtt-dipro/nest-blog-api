import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FakeLoginModule } from '../fake-login/fake-login.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FakeLoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
