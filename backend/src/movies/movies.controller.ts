import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Movies')
@ApiBearerAuth() 
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({ summary: 'Get list of movies with search and pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'query', required: false, example: 'Inception', description: 'Filter by movie title' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMovies(
    @Query('page') page: number = 1,
    @Query('query') query?: string,
  ) {
    return this.moviesService.getMovies({ page, query });
  }
}
