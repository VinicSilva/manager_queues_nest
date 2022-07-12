import { Injectable } from '@nestjs/common';
import {
  InjectQueue,
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import * as cacheHelper from './cache.helper';

@Injectable()
@Processor('messages-queue')
class MessageConsumer {
  constructor(@InjectQueue('messages-reprocess-queue') private queue: Queue) {}

  @Process({
    name: 'messages-job',
    concurrency: 10,
  })
  async sendJob(job: Job<any>): Promise<void> {
    const { data } = job;
    const [firstData] = await cacheHelper.lrange(data.contactKey, 0, 0);
    if (firstData && firstData !== data.traceId) {
      await this.queue.add('messages-reprocess-job', data, job.opts)
    } else {
      const delayValue = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
      console.log(`🚀  ${new Date()} | delay: ${delayValue} |  [Job] ${job.name} On Process => `, data);
      const later = (delay, value) => new Promise((resolve) => setTimeout(resolve, delay, value));
      await later(delayValue, 'DELAY');
      await cacheHelper.lrem(data.contactKey, firstData)
      console.log(`🚀  ${new Date()} | [Job] ${job.name} Sent message => `, data);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    const { data } = job;
    // console.log(`🚀  ${new Date()} [Job] ${job.name} On Active => `, data);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    const { data } = job;
    // console.log(`🚀  ${new Date()} [Job] ${job.name} On Completed => `, data);
  }

  @OnQueueFailed()
  OnQueueFailed(job: Job, error: Error) {
    const { data } = job;
    console.log(
      `🚀  ${new Date()} [Job] ${job.name} On Failed => (${error.message})`,
      data,
    );
  }

  @OnQueueError()
  OnQueueError(error: Error) {
    console.log(`🚀  ${new Date()}[Job] On Error => (${error.message})`, {
      error: error.message,
      stack: error.stack,
    });
  }

  @OnQueueCleaned()
  OnQueueCleaned(job: Job, type: string) {
    console.log(`[Job] ${job.name} | ${type} | On Cleaned => `, {
      ...job.data,
    });
  }
}

export { MessageConsumer };
