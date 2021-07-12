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
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe } from './validations/validation';
import UsersSchema from './joiSchema/users.joischema';
import tripsJoischema from './joiSchema/trips.joischema';
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

  @Post('login')
  getlogin(@Body() body: CreateUserDto): any {
    return this.authService.login(body);
  }

  @Post('users')
  createUser(
    @Body(new JoiValidationPipe(UsersSchema)) body: CreateUserDto,
  ): any {
    return this.appService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Request() req): Promise<any> {
    console.log(req.user);
    return this.appService.getUsers(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  getUser(@Param('id') id: number, @Request() req): any {
    return this.appService.getUser(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  updateUser(
    @Param('id') id: number,
    @Body() body: CreateUserDto,
    @Request() req,
  ): any {
    return this.appService.updateUser(id, body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  deleteUser(@Param('id') id: number, @Request() req): any {
    return this.appService.deleteUser(id, req);
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
  @Post(':id/trip')
  createTrip(
    @Param('id') id: number,
    @Body(new JoiValidationPipe(tripsJoischema)) body: CreateTripDto,
  ): any {
    return this.appService.createTrip(id, body);
  }
  @UseGuards(JwtAuthGuard)
  @Put('trip/:id')
  updateTrip(
    @Param('id') id: number,
    @Request() req,
    @Body() body: CreateTripDto,
  ): any {
    return this.appService.updateTrip(id, body, req);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('trip/:id')
  deleteTrip(@Param('id') id: number, @Request() req): any {
    return this.appService.deleteTrip(id, req);
  }
}
