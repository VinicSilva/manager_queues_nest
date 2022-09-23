import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import * as rTracer from 'cls-rtracer';

@Injectable()
class MessageProducer {
  logger = new Logger(MessageProducer.name);

  constructor(@InjectQueue('messages-queue') private queue: Queue) {}

  async send(message: any): Promise<void> {
    const traceId = rTracer.id() as string
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [${traceId}] - REQUEST GENERATE REPORT`);

    await this.queue.add('messages-job', message, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
    });
  }
}

export { MessageProducer };
