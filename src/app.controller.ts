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
} from '@nestjs/common';
// import Joi from '@hapi/joi';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { AuthenticatedGuard } from './auth/authenticated.guard';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe } from './validation';
import UsersSchema from './users.joischema';
import tripsJoischema from './trips.joischema';
import { Query } from '@nestjs/common';
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Request() req): Promise<any> {
    console.log(req.user);
    return this.appService.getUsers(req);
  }

  @Post('users')
  createUser(
    @Body(new JoiValidationPipe(UsersSchema)) body: CreateUserDto,
  ): any {
    return this.appService.createUser(body);
  }
  @Post('login')
  getlogin(@Body() body: CreateUserDto): any {
    return this.authService.login(body);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/trips')
  getTrips(
    @Param('id') id: number,
    @Query('page') page: number,
    @Request() req,
  ): any {
    return this.appService.getTrips(id, page, req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  getUser(@Param('id') id: number, @Request() req): any {
    return this.appService.getUser(id, req);
  }
  @Put('users/:id')
  updateUser(
    @Param('id') id: number,
    @Body() body: CreateUserDto,
    @Request() req,
  ): any {
    console.log('*******************');
    console.log(req.user);
    console.log('*******************');
    return this.appService.updateUser(id, body, req);
  }
  @Delete('users/:id')
  deleteUser(@Param('id') id: number): any {
    return this.appService.deleteUser(id);
  }
  @Post(':id/trip')
  createTrip(
    @Param('id') id: number,
    @Body(new JoiValidationPipe(tripsJoischema)) body: CreateTripDto,
  ): any {
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
