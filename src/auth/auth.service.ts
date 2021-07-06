/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user.entity';
import { CreateUserDto } from 'src/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await User.findOne(username);
    if (user && password === user.Password) {
      const { Password, Name, ...rest } = user;
      return rest;
    }
    return null;
  }
  async login(createUserDto: CreateUserDto): Promise<any> {
    console.log(createUserDto);
    const payload = {
      name: createUserDto.Name,
      sub: createUserDto.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
