import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Trip } from './trip.entity';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
  ) {}
  async seed() {
    await this.userRepo.delete({});
    const user = this.userRepo.create({
      Name: 'user1',
      Email: 'asx@gmail.com',
    });
    await this.userRepo.save(user);

    const user2 = this.userRepo.create({
      Name: 'user2',
      Email: 'asxs@gmail.com',
    });
    await this.userRepo.save(user2);

    const trip1 = this.tripRepo.create({
      destination: 'New York',
      start_date: new Date(2021, 1, 1),
      end_date: new Date(2021, 6, 6),
      comment: 'amazing',
    });
    const trip2 = this.tripRepo.create({
      destination: 'New Jersey',
      start_date: new Date(2021, 1, 1),
      end_date: new Date(2021, 6, 6),
      comment: 'trip was amazing',
    });
    user.trips = [trip1, trip2];
    await this.tripRepo.save(trip1);
    await this.tripRepo.save(trip2);
    await this.userRepo.save(user);
  }
  async getUsers(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['trips'],
    });
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
  async loginUser(createUserDto: CreateUserDto): Promise<any> {
    console.log(createUserDto);
    const user = await this.userRepo.findOne({ Name: createUserDto.Name });
    const match = await bcrypt.compare(createUserDto.Password, user.Password);
    if (match) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
    return null;
  }
  async updateUser(id: number, createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ id: id });
    // const newUser = { ...user, ...updateUserDto };
    await this.userRepo.save({ ...user, ...createUserDto });
    return user;
  }
  async deleteUser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ id: id });
    await this.userRepo.delete(user);
    return user;
  }
  async getTrips(id: number, page: number): Promise<Trip[]> {
    const trips = await this.tripRepo.find({ employeeId: id });
    page = page - 1;
    const start = page * 6;
    const end = start + 6;
    const arr = [];
    for (let i = start; i < end; i++) {
      arr.push(trips[i]);
    }
    return arr;
  }
  async createTrip(id: number, createTripDto: CreateTripDto): Promise<User> {
    const trip = this.tripRepo.create({ ...createTripDto, id: Date.now() });
    await this.tripRepo.save(trip);
    const user = await this.userRepo.findOne({ id: id });
    trip.employeeId = user.id;
    await this.tripRepo.save(trip);
    return user;
  }
  async updateTrip(id: number, createTripDto: CreateTripDto): Promise<Trip> {
    const trip = await this.tripRepo.findOne({ id: id });
    await this.tripRepo.save({ ...trip, ...createTripDto });
    return trip;
  }
  async deleteTrip(id: number): Promise<Trip> {
    const trip = await this.tripRepo.findOne({ id: id });
    console.log(trip);
    await this.tripRepo.remove(trip);
    return trip;
  }
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create({ ...createUserDto });
    await this.userRepo.save(user);
    return user;
  }
}
