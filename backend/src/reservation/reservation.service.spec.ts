import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservations } from './entities/reservation.entity';
import { Users } from '../auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: Repository<Reservations>;
  let userRepository: Repository<Users>;

  const mockReservationRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservations),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<Repository<Reservations>>(
      getRepositoryToken(Reservations),
    );
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should throw an error if the user does not exist', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    mockReservationRepository.findOne.mockResolvedValue(null);

    await expect(
      service.createReservation(1, 101, new Date()),
    ).rejects.toThrow(BadRequestException);
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const userId = 1;
      const movieId = 101;
      const screeningTime = new Date('2025-02-06T19:00:00.000Z');

      mockUserRepository.findOne.mockResolvedValue({ id: userId } as Users);
      mockReservationRepository.findOne.mockResolvedValue(null);
      mockReservationRepository.create.mockReturnValue({
        userId,
        movieId,
        screeningTime,
      } as Reservations);
      mockReservationRepository.save.mockResolvedValue({
        userId,
        movieId,
        screeningTime,
      } as Reservations);

      const result = await service.createReservation(
        userId,
        movieId,
        screeningTime,
      );
      expect(result).toEqual({ userId, movieId, screeningTime });
    });

    it('should throw an error if the user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReservation(1, 101, new Date()),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if booking is within 2 hours of last reservation', async () => {
      const userId = 1;
      const lastReservation = {
        screeningTime: new Date(Date.now() - 60 * 60 * 1000),
      }; // 1 hour ago

      mockUserRepository.findOne.mockResolvedValue({ id: userId } as Users);
      mockReservationRepository.findOne.mockResolvedValue(
        lastReservation as Reservations,
      );

      await expect(
        service.createReservation(userId, 101, new Date()),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation successfully', async () => {
      const reservationId = 1;
      mockReservationRepository.findOne.mockResolvedValue({
        id: reservationId,
      } as Reservations);
      mockReservationRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await expect(service.deleteReservation(reservationId)).resolves.not.toThrow();
    });

    it('should throw an error if reservation does not exist', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteReservation(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUserReservations', () => {
    it('should return reservations for a user', async () => {
      const userId = 1;
      const reservations = [
        { id: 1, userId, movieId: 101, screeningTime: new Date() },
        { id: 2, userId, movieId: 102, screeningTime: new Date() },
      ];

      mockReservationRepository.find.mockResolvedValue(
        reservations as Reservations[],
      );

      const result = await service.getUserReservations(userId);
      expect(result).toEqual(reservations);
    });
  });
});