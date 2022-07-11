import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('messages') private messageQueue: Queue) {}

  async send(): Promise<string> {
    this.messageQueue.add('t1', { message: 'xpto' });
    return 'Hello World!';
  }
}
