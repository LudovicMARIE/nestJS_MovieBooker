import { IsInt, IsISO8601, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'User ID making the reservation' })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 101, description: 'Movie ID being reserved' })
  @IsInt()
  @Min(1)
  movieId: number;

  @ApiProperty({ example: '2025-02-06T21:00:00.000Z', description: 'Screening time in ISO format' })
  @IsISO8601()
  screeningTime: string;
}
