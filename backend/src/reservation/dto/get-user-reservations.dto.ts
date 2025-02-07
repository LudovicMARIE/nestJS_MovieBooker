import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserReservationsDto {
  @ApiProperty({ example: 1, description: 'User ID to fetch reservations' })
  @IsInt()
  @Min(1)
  userId: number;
}
