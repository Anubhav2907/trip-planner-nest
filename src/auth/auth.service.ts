/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { JWT } from 'src/entities/jwt.entity';
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
    console.log(createUserDto.Email);
    const user = await User.findOne({ Email: createUserDto.Email });
    const payload = {
      name: user.Name,
      id: user.id,
      email: user.Email,
      role: user.Role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async logout(req: any): Promise<any> {
    const token = req.headers.authorization.slice(7);
    console.log(token);
    const newToken = await JWT.create({ jwttoken: token });
    await JWT.save(newToken);
    return new BadRequestException('hi');
  }
  async getExpiredTokens(): Promise<any> {
    const tokens = await JWT.find({});
    return tokens;
  }
}
