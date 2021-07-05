import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Trip } from './trip.entity';
import { User } from './user.entity';

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
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create({ id: Date.now(), ...createUserDto });
    await this.userRepo.save(user);
    return user;
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

  async createTrip(id: number, createTripDto: CreateTripDto): Promise<User> {
    const trip = this.tripRepo.create({ ...createTripDto, id: Date.now() });
    await this.tripRepo.save(trip);
    const user = await this.userRepo.findOne({ id: id });
    trip.employeeId = user.id;
    await this.tripRepo.save(trip);
    return user;
  }
}
