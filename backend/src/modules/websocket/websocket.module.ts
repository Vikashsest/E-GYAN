import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketController } from './websocket.controller';
import { OnlineGateway } from './online.gateway';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, OnlineGateway],
})
export class WebsocketModule {}
