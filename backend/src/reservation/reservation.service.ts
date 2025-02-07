import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservations } from './entities/reservation.entity';
import { Users } from '../auth/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationRepository: Repository<Reservations>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async createReservation(userId: number, movieId: number, screeningTime: Date): Promise<Reservations> {
    const lastReservation = await this.reservationRepository.findOne({
      where: { userId },
      order: { screeningTime: 'DESC' },
    });

    if (lastReservation) {
      const twoHoursLater = new Date(lastReservation.screeningTime.getTime() + 2 * 60 * 60 * 1000);
      if (screeningTime < twoHoursLater) {
        throw new UnauthorizedException('You must wait at least 2 hours between reservations.');
      }
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const reservation = this.reservationRepository.create({ userId, movieId, screeningTime });
    return await this.reservationRepository.save(reservation);
  }

  async deleteReservation(reservationId: number): Promise<void> {
    if (!reservationId) {
      throw new BadRequestException('Reservation ID must be provided.');
    }
  
    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId } });
  
    if (!reservation) {
      throw new BadRequestException('Reservation not found.');
    }
  
    await this.reservationRepository.delete(reservationId);
  }
  

  async getUserReservations(userId: number): Promise<Reservations[]> {
    return await this.reservationRepository.find({ where: { userId } });
  }
}
