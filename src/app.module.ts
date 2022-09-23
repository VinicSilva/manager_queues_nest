import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessageConsumer } from './messages/message.consumer';
import { MessageProducer } from './messages/message.producer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
        password: ''
      },
    }),
    BullModule.registerQueue({
      name: 'messages-queue',
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [MessageConsumer, MessageProducer],
})
export class AppModule {}
