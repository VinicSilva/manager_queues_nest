import {
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

@Processor('messages-queue')
class MessageConsumer {
  @Process({
    name: 'messages-job',
    concurrency: 3,
  })
  async sendJob(job: Job<any>): Promise<void> {
    const { data } = job;
    const delayValue = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    console.log(`🚀  ${new Date()} | delay: ${delayValue} |  [Job] ${job.name} On Process CONTINUE => `, data);
    const later = (delay, value) => new Promise((resolve) => setTimeout(resolve, delay, value));
    await later(delayValue, 'DELAY');
    // throw new Error();
  }

  @OnQueueActive()
  onActive(job: Job) {
    const { data } = job;
    console.log(`🚀  ${new Date()} [Job] ${job.name} On Active => `, data);
  }

  @OnQueueProgress()
  OnQueueProgress(job: Job) {
    const { data } = job;
    console.log(`[Job] ${job.name} On Progress => `, data);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    const { data } = job;
    console.log(`🚀  ${new Date()}[Job] ${job.name} On Completed => `, data);
  }

  @OnQueueFailed()
  OnQueueFailed(job: Job, error: Error) {
    const { data } = job;
    console.log(
      `🚀  ${new Date()}[Job] ${job.name} On Error => (${error.message})`,
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
