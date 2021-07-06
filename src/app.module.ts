import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Trip } from './trip.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
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
