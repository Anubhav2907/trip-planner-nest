import { Body, Post } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // await this.appService.seed();
    return 'this.appService.getUsers()';
  }
  @Get('users')
  async getUsers(): Promise<any> {
    // await this.appService.seed();
    return this.appService.getUsers();
  }
  @Post('users')
  createUser(@Body() body: CreateUserDto): any {
    // await this.appService.seed();
    return this.appService.createUser(body);
  }
}
