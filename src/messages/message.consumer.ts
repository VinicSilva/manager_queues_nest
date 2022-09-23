import { Injectable, Logger } from '@nestjs/common';
import {
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { writeFileSync } from 'fs';


@Injectable()
@Processor('messages-queue')
class MessageConsumer {
  logger = new Logger(MessageConsumer.name);
  constructor(private readonly httpService: HttpService) {}

  @Process({
    name: 'messages-job',
    concurrency: 5
  })
  async sendJob(job: Job<any>): Promise<void> {
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [Job] ${job.name} On Function => ${job.id}`);
    const header = { headers: { 'Content-Type': 'application/json' } };
    const response = await lastValueFrom(this.httpService.get('https://www.redesocialdecidades.org.br/indicators', header).pipe(map((res) => res.data)));
    await writeFileSync(`/Users/marcosvinicius/workspace/manager_queues_nestjs/tmp/test-file-${(Math.random() + 1).toString(36).substring(7)}.json`, JSON.stringify(response, null, 2), 'utf8');
    // this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} | RESPONSE |  [Job] ${job.name} On Process => `, response);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [Job] ${job.name} On Active => ${job.id}`);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [Job] ${job.name} On Completed => ${job.id}`);
  }

  @OnQueueFailed()
  OnQueueFailed(job: Job, error: Error) {
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [Job] ${job.name} On Failed => (${error.message}) => ${job.id}`);
  }

  @OnQueueError()
  OnQueueError(error: Error) {
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [Job] On Failed => (${error.message}) => `, {
      error: error.message,
      stack: error.stack,
    });
  }

  @OnQueueCleaned()
  OnQueueCleaned(job: Job, type: string) {
    this.logger.log(`🚀  ${new Date().toLocaleDateString('pt-br')} [Job] ${job.name} | ${type} | On Cleaned => ${job.id}`);
  }
}

export { MessageConsumer };
