import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: 'https://egyan.ptgn.in',
    credentials: true,
  },
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private onlineService: WebsocketService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      console.log('Socket connected:', client.id);
      console.log('socket on');

      const cookie = client.handshake.headers.cookie;
      if (!cookie) return this.disconnect(client);

      const token = cookie
        .split('; ')
        .find((c) => c.startsWith('access_token='))
        ?.split('=')[1];

      if (!token) return this.disconnect(client);
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is not defined in environment');
      }
      const decoded: any = jwt.verify(token, secret);

      const userId = decoded?.id || decoded?.sub;
      if (!userId) return this.disconnect(client);

      this.onlineService.addUser(userId);
      console.log('User connected:', userId);

      this.server.emit('onlineCount', this.onlineService.getCount());
    } catch (e) {
      console.log('Socket connection error:', e.message);
      this.disconnect(client);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return;
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is not defined in environment');
      }
      const decoded: any = jwt.verify(token, secret);
      const userId = decoded?.id || decoded?.sub;

      if (!userId) return;

      this.onlineService.removeUser(userId);
      console.log('User disconnected:', userId);

      this.server.emit('onlineCount', this.onlineService.getCount());
    } catch (e) {
      console.log('Socket disconnect error:', e.message);
    }
  }

  private disconnect(client: Socket) {
    console.log('Socket rejected: invalid token');
    client.disconnect();
  }
}
