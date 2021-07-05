import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Trip } from './trip.entity';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Trip]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
