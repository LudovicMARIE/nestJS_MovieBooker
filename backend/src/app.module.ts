import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    AuthModule, 
    MoviesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    ReservationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
