import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Trip } from './entities/trip.entity';
import { User } from './entities/user.entity';
import verify from './utils/utils';
import * as bcrypt from 'bcrypt';
import verifyTrip from './utils/trip';
import dateConversion from './utils/dateConversion';
import convertMonth from './utils/monthConverter';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
  ) {}
  async getUsers(req: any): Promise<any> {
    const verification = verify.verifyRole(req.user);
    if (verification == true) {
      return this.userRepo.find({
        relations: ['trips'],
      });
    } else {
      return new BadRequestException(
        'You are not authorized to view this page',
      );
    }
  }
  async getUser(id: number, req: any): Promise<any> {
    const verification = verify.verifyRole(req.user);
    if (verification == true) {
      const user = await this.userRepo.findOne({ id: id });
      return user;
    } else {
      return new BadRequestException(
        'You are not authorized to view this page',
      );
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const user = this.userRepo.create({ id: Date.now(), ...createUserDto });
    const a = await this.userRepo.findOne({ Email: createUserDto.Email });
    if (a) {
      return 'User already exists';
    } else {
      console.log(createUserDto.Password);
      const pass = await bcrypt.hash(createUserDto.Password, 10);
      console.log(pass);
      user.Password = pass;
      await this.userRepo.save(user);
      return user;
    }
  }

  async updateUser(
    id: number,
    createUserDto: CreateUserDto,
    req: any,
  ): Promise<any> {
    const user = await this.userRepo.findOne({ id: id });
    const verification = verify.verifyUser(user, req.user);
    if (verification == true) {
      await this.userRepo.save({ ...user, ...createUserDto });
      return user;
    } else {
      return new BadRequestException(
        'You are not authorized to view this page',
      );
    }
  }
  async deleteUser(id: number, req: any): Promise<any> {
    const user = await this.userRepo.findOne({ id: id });
    const verification = verify.verifyUser(user, req.user);
    if (verification == true) {
      await this.userRepo.delete(user);
      return user;
    }
    return new BadRequestException('You are not authorized to view this page');
  }

  async createTrip(id: number, createTripDto: CreateTripDto): Promise<User> {
    const trip = this.tripRepo.create({ ...createTripDto, id: Date.now() });
    const d = new Date(createTripDto.start_date);
    const newDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
    ).toDateString();
    trip.start_date = new Date(newDate);
    await this.tripRepo.save(trip);
    const user = await this.userRepo.findOne({ id: id });
    trip.employeeId = user.id;
    await this.tripRepo.save(trip);
    return user;
  }

  async updateTrip(
    id: number,
    createTripDto: CreateTripDto,
    req: any,
  ): Promise<any> {
    const trip = await this.tripRepo.findOne({ id: id });
    const userId = trip.employeeId;
    const user = await this.userRepo.findOne({ id: userId });
    const verification = verify.verifyUser(user, req.user);
    if (verification == true) {
      await this.tripRepo.save({ ...trip, ...createTripDto });
      return trip;
    } else {
      return new BadRequestException(
        'You are not authorized to view this page',
      );
    }
  }

  async deleteTrip(id: number, req: any): Promise<any> {
    const trip = await this.tripRepo.findOne({ id: id });
    const userId = trip.employeeId;
    const user = await this.userRepo.findOne({ id: userId });
    const verification = verify.verifyUser(user, req.user);
    if (verification == true) {
      await this.tripRepo.remove(trip);
      return trip;
    } else {
      return new BadRequestException(
        'You are not authorized to view this page',
      );
    }
  }
  async getTrip(id: number, req: any): Promise<any> {
    const trip = await this.tripRepo.findOne({ id: id });
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      return { trip };
    } else {
      return new BadRequestException(
        'You are not authorized to view this page',
      );
    }
  }
  async getNextMonthPlan(req: any): Promise<any> {
    const trips = await this.tripRepo.find({
      employeeId: req.user.id,
    });
    console.log(trips);
    const nextTrips = [];
    const date = Date.now();
    const d = dateConversion(date);
    const m = convertMonth(d[1]);
    for (let i = 0; i < trips.length; i++) {
      const startDate = dateConversion(trips[i].start_date);
      if (convertMonth(startDate[1]) != 12) {
        if (convertMonth(startDate[1]) == m + 1) {
          nextTrips.push(trips[i]);
        }
      } else {
        if (
          startDate[3] == startDate[3] + 1 &&
          convertMonth(startDate[1]) == 1
        ) {
          nextTrips.push(trips[i]);
        }
      }
    }
    return nextTrips;
  }
  async getTrips(
    id: number,
    page: number,
    req: any,
    startDateStarts: Date,
    startDateEnds: Date,
    endDateStarts: Date,
    endDateEnds: Date,
  ): Promise<any> {
    if (!page && !startDateStarts && !endDateStarts) {
      const trips = await this.tripRepo.find({ employeeId: id });
      return trips;
    }
    if (!startDateStarts && !endDateStarts && page) {
      const user = await this.userRepo.findOne({ id: id });
      const verification = verify.verifyUser(user, req.user);
      console.log(verification);
      if (verification == true) {
        const trips = await this.tripRepo.find({
          employeeId: id,
        });
        page = page - 1;
        const start = page * 6;
        const end = start + 6;
        const arr = [];
        for (let i = start; i < end; i++) {
          arr.push(trips[i]);
        }
        return arr;
      } else {
        return new BadRequestException(
          'You are not authorized to view this page',
        );
      }
    }

    if (startDateStarts && page) {
      const user = await this.userRepo.findOne({ id: id });
      const verification = verify.verifyUser(user, req.user);
      console.log(verification);
      if (verification == true) {
        const trips = await this.tripRepo.find({
          employeeId: id,
        });
        console.log(trips);
        const filteredTrips = [];
        const convertedStartDate = dateConversion(startDateStarts);
        const convertedEndDate = dateConversion(startDateEnds);
        console.log(convertedStartDate, convertedEndDate);
        for (let i = 0; i < trips.length; i++) {
          const startDate = dateConversion(trips[i].start_date);
          const endDate = dateConversion(trips[i].end_date);
          console.log(startDate, endDate, convertedStartDate, convertedEndDate);
          if (
            verifyTrip.verifyTrip(
              startDate,
              endDate,
              convertedStartDate,
              convertedEndDate,
            )
          ) {
            filteredTrips.push(trips[i]);
          }
        }
        // console.log(filteredTrips);
        page = page - 1;
        const start = page * 6;
        const end = start + 6;
        const arr = [];
        for (let i = start; i < end; i++) {
          arr.push(filteredTrips[i]);
        }
        return arr;
      } else {
        return new BadRequestException(
          'You are not authorized to view this page',
        );
      }
    }

    if (endDateStarts && page) {
      const user = await this.userRepo.findOne({ id: id });
      const verification = verify.verifyUser(user, req.user);
      console.log(verification);
      if (verification == true) {
        const trips = await this.tripRepo.find({
          employeeId: id,
        });
        console.log(trips);
        const filteredTrips = [];
        const convertedStartDate = dateConversion(endDateStarts);
        const convertedEndDate = dateConversion(endDateEnds);
        for (let i = 0; i < trips.length; i++) {
          const startDate = dateConversion(trips[i].start_date);
          const endDate = dateConversion(trips[i].end_date);
          if (
            verifyTrip.verifyTripEnd(
              startDate,
              endDate,
              convertedStartDate,
              convertedEndDate,
            )
          ) {
            filteredTrips.push(trips[i]);
          }
        }
        console.log(filteredTrips);
        page = page - 1;
        const start = page * 6;
        const end = start + 6;
        const arr = [];
        for (let i = start; i < end; i++) {
          arr.push(filteredTrips[i]);
        }
        return arr;
      } else {
        return new BadRequestException(
          'You are not authorized to view this page',
        );
      }
    }
  }
}
