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

@Injectable()
@Processor('messages-reprocess-queue')
class MessageReprocessConsumer {
  constructor(@InjectQueue('messages-queue') private queue: Queue) {}

  @Process({
    name: 'messages-reprocess-job',
    concurrency: 10,
  })
  async sendJob(job: Job<any>): Promise<void> {
    const { data, opts } = job;
    // console.log(`🚀  ${new Date()} | [Job] ${job.name} On Start Process => `, data);
    await this.queue.add('messages-job', data, {
      ...opts,
      delay: 1000
    })
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
    console.log(`🚀  ${new Date()} [Job] On Error => (${error.message})`, {
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

export { MessageReprocessConsumer };
