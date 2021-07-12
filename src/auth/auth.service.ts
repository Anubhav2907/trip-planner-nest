/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { JWT } from 'src/entities/jwt.entity';
import { CreateUserDto } from 'src/dto/create-user.dto';
let a = 'a';
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
    console.log(createUserDto.Email);
    const user = await User.findOne({ Email: createUserDto.Email });
    const payload = {
      name: user.Name,
      id: user.id,
      email: user.Email,
      role: user.Role,
    };
    a = this.jwtService.sign(payload);
    return {
      access_token: a,
    };
  }
  async logout(req: any): Promise<any> {
    if (a.length > 1) {
      const token = await JWT.create({ jwttoken: a });
      await JWT.save(token);
      return token;
    } else {
      return new BadRequestException('Token not found');
    }
  }
  async getExpiredTokens(): Promise<any> {
    const tokens = await JWT.find({});
    return tokens;
  }
}
