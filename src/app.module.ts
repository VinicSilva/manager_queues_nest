import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessageReprocessConsumer } from './messages/message-reprocess.consumer';
import { MessageConsumer } from './messages/message.consumer';
import { MessageProducer } from './messages/message.producer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'hub'
      },
    }),
    BullModule.registerQueue({
      name: 'messages-queue',
    },
    {
      name: 'messages-reprocess-queue',
    }),
  ],
  controllers: [AppController],
  providers: [MessageConsumer, MessageProducer, MessageReprocessConsumer],
})
export class AppModule {}
