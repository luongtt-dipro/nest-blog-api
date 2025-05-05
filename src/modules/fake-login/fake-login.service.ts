import { Injectable } from '@nestjs/common';
import { LoginFakeDTO } from './dtos/req.dto';

@Injectable()
export class FakeLoginService {
  loginFake(body: LoginFakeDTO) {
    console.log(body);
  }
}
