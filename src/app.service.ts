import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  async send(): Promise<string> {
    return 'Hello World!';
  }
}
