import { Controller, Post, Delete, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetUserReservationsDto } from './dto/get-user-reservations.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reservations') 
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Create a new reservation' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createReservation(@Body() data: CreateReservationDto) {
    const screeningDate = new Date(data.screeningTime);
    return this.reservationService.createReservation(data.userId, data.movieId, screeningDate);
  }

  @ApiOperation({ summary: 'Delete a reservation' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteReservation(@Param('id') reservationId: number) {
    return this.reservationService.deleteReservation(reservationId);
  }



  @ApiOperation({ summary: 'Get all reservations for a user' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getUserReservations(@Param() params: GetUserReservationsDto) {
    return this.reservationService.getUserReservations(params.userId);
  }
}
