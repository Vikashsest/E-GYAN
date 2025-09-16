import { UserRole } from '../../modules/user/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: UserRole;
    }
  }
}

export {};
