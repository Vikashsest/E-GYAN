import { Controller, Get } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly websocketService: WebsocketService) {}

  @Get('count')
  getOnlineCount() {
    return { count: this.websocketService.getCount() };
  }

  @Get('users')
  getOnlineUsers() {
    return { users: this.websocketService.getAll() };
  }
}
