import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as cacheHelper from './cache.helper';

@Injectable()
class MessageProducer {
  constructor(@InjectQueue('messages-queue') private queue: Queue) {}

  async send(message: any): Promise<void> {
    console.log('🚀 ~ INSERT MESSAGE IN QUEUE: ', message);
    await this.queue.add('messages-job', message, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }
}

export { MessageProducer };
