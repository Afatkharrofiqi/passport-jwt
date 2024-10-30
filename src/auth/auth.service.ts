import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from 'src/dto/auth.dto';

class User {
  id: number;
  username: string;
  password: string;
}

const fakeUsers: User[] = [
  {
    id: 1,
    username: 'arthur',
    password: 'password',
  },
  {
    id: 2,
    username: 'jack',
    password: 'password123',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser({ username, password }: AuthPayloadDto) {
    const findUser = fakeUsers.find((user) => user.username === username);    
    if (!findUser) return null;
    if (password == findUser.password) {
      const { password: _, ...user } = findUser;
      return this.jwtService.sign(user);
    }
  }
}
