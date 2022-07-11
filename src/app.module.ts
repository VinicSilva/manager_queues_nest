import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessageConsumer } from './messages/message.consumer';
import { MessageProducer } from './messages/message.producer';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'messages-queue',
    }),
  ],
  controllers: [AppController],
  providers: [MessageConsumer, MessageProducer],
})
export class AppModule {}
