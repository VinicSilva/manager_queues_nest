import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
class MessageProducer {
  constructor(@InjectQueue('messages-queue') private queue: Queue) {}

  async send(message: any): Promise<void> {
    console.log('🚀 ~ INSERT MESSAGE IN QUEUE: ', { message });
    this.queue.add('messages-job', message, {
      attempts: 3,
      removeOnComplete: true,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
    });
  }
}

export { MessageProducer };
