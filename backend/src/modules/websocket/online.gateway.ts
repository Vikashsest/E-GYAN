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

      // ✅ JWT secret check
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        console.log('JWT_ACCESS_SECRET is not defined!');
        return this.disconnect(client);
      }

      // ✅ Token from cookie
      const cookie = client.handshake.headers.cookie;
      if (!cookie) return this.disconnect(client);

      const token = cookie
        .split('; ')
        .find((c) => c.startsWith('access_token='))
        ?.split('=')[1];

      if (!token) return this.disconnect(client);

      // ✅ JWT verify
      let decoded: any;
      try {
        decoded = jwt.verify(token, secret);
      } catch (err) {
        console.log('Invalid token', err.message);
        return this.disconnect(client);
      }

      const userId = decoded?.id || decoded?.sub;
      if (!userId) return this.disconnect(client);

      // ✅ Add user to online list (multi-tab safe)
      this.onlineService.addUser(userId);

      console.log(
        'User connected:',
        userId,
        'Online count:',
        this.onlineService.getCount(),
      );

      // ✅ Emit updated count to all clients
      this.server.emit('onlineCount', this.onlineService.getCount());
    } catch (e) {
      console.log('Socket connection error:', e.message);
      this.disconnect(client);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) return;

      // Try token from cookie or auth header
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1] ||
        client.handshake.headers?.cookie
          ?.split('; ')
          .find((c) => c.startsWith('access_token='))
          ?.split('=')[1];

      if (!token) return;

      let decoded: any;
      try {
        decoded = jwt.verify(token, secret);
      } catch {
        return;
      }

      const userId = decoded?.id || decoded?.sub;
      if (!userId) return;

      // ✅ Remove user (multi-tab safe)
      this.onlineService.removeUser(userId);

      console.log(
        'User disconnected:',
        userId,
        'Online count:',
        this.onlineService.getCount(),
      );

      // ✅ Emit updated count
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
