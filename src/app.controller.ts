import { Body, Controller, Post } from '@nestjs/common';
import { MessageProducer } from './messages/message.producer';

@Controller()
export class AppController {
  constructor(private readonly messageProducer: MessageProducer) {}

  @Post()
  send(@Body() body: any): void {
    this.messageProducer.send(body);
  }
}
