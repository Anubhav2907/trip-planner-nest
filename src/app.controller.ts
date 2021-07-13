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
  @UseGuards(JwtAuthGuard)
  @Get('expired')
  getExpiredTokens(): any {
    return this.authService.getExpiredTokens();
  }
  @Post('user/login')
  getlogin(@Body() body: CreateUserDto): any {
    return this.authService.login(body);
  }

  @Post('user/signup')
  createUser(
    @Body(new JoiValidationPipe(UsersSchema)) body: CreateUserDto,
  ): any {
    return this.appService.createUser(body);
  }
  @UseGuards(JwtAuthGuard)
  @Post('user/logout')
  getlogout(@Request() req): any {
    return this.authService.logout(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUsers(@Request() req): Promise<any> {
    console.log(req.user);
    console.log(req.headers);
    return this.appService.getUsers(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getUser(@Param('id') id: number, @Request() req): any {
    return this.appService.getUser(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/:id')
  updateUser(
    @Param('id') id: number,
    @Body() body: CreateUserDto,
    @Request() req,
  ): any {
    return this.appService.updateUser(id, body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  deleteUser(@Param('id') id: number, @Request() req): any {
    return this.appService.deleteUser(id, req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/trips/:id')
  getTrip(@Param('id') id: number, @Request() req): any {
    return this.appService.getTrip(id, req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/trip/next_month_plan')
  getNextMonthPlan(@Request() req): any {
    return this.appService.getNextMonthPlan(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('trip/:id')
  getTrips(
    @Param('id') id: number,
    @Query('page') page: number,
    @Query('startDateStarts') startDateStarts: Date,
    @Query('startDateEnds') startDateEnds: Date,
    @Query('endDateStarts') endDateStarts: Date,
    @Query('endDateEnds') endDateEnds: Date,

    @Request() req,
  ): any {
    return this.appService.getTrips(
      id,
      page,
      req,
      startDateStarts,
      startDateEnds,
      endDateStarts,
      endDateEnds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('trip/:id')
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
