/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe } from './validation';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}
  @Post('login')
  getlogin(@Body() body: CreateUserDto): any {
    return this.authService.login(body);
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(): Promise<any> {
    return this.appService.getUsers();
  }
  @Post('users')
  @UsePipes(JoiValidationPipe)
  createUser(@Body() body: CreateUserDto): any {
    return this.appService.createUser(body);
  }
  @Post('users/login')
  login(@Body() body: CreateUserDto): any {
    return this.appService.loginUser(body);
  }
  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() body: CreateUserDto): any {
    return this.appService.updateUser(id, body);
  }
  @Delete('users/:id')
  deleteUser(@Param('id') id: number): any {
    return this.appService.deleteUser(id);
  }
  @Post(':id/trip')
  createTrip(@Param('id') id: number, @Body() body: CreateTripDto): any {
    return this.appService.createTrip(id, body);
  }
  @Put('trip/:id')
  updateTrip(@Param('id') id: number, @Body() body: CreateTripDto): any {
    return this.appService.updateTrip(id, body);
  }
  @Delete('trip/:id')
  deleteTrip(@Param('id') id: number): any {
    return this.appService.deleteTrip(id);
  }
}
