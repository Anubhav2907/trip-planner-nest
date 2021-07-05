import { Body, Delete, Param, Post } from '@nestjs/common';
import { Put } from '@nestjs/common';
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
  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() body: CreateUserDto): any {
    // await this.appService.seed();
    return this.appService.updateUser(id, body);
  }
  @Delete('users/:id')
  deleteUser(@Param('id') id: number): any {
    // await this.appService.seed();
    return this.appService.deleteUser(id);
  }
}
