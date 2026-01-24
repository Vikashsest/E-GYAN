import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketService {
  private onlineUsers = new Set<string>();

  addUser(userId: string) {
    this.onlineUsers.add(userId);
  }
  removeUser(userId: string) {
    this.onlineUsers.delete(userId);
  }

  getCount() {
    return this.onlineUsers.size;
  }

  getAll() {
    return Array.from(this.onlineUsers);
  }
}
