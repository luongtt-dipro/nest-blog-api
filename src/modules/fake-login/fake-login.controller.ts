import { Body, Controller, Post } from '@nestjs/common';
import { LoginFakeDTO } from './dtos/req.dto';
import { FakeLoginService } from './fake-login.service';

@Controller('fake-login')
export class FakeLoginController {
  constructor(private readonly fakeLoginService: FakeLoginService) {}

  @Post('')
  loginFake(@Body() body: LoginFakeDTO) {
    return this.fakeLoginService.loginFake(body);
  }
}
