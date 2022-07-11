import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as cacheHelper from './cache.helper';

@Injectable()
class MessageProducer {
  constructor(@InjectQueue('messages-queue') private queue: Queue) {}

  async send(message: any): Promise<void> {
    const lengthInContactQueue = await cacheHelper.llen(message.contactKey)
    const priorityByContact = lengthInContactQueue + 1;
    cacheHelper.rpush(message.contactKey, JSON.stringify(message), 120)
    console.log('🚀 ~ INSERT MESSAGE IN QUEUE: ', { message, priorityByContact });
    
    this.queue.add('messages-job', message, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
      priority: priorityByContact
    });
  }
}

export { MessageProducer };
