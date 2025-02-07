import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
  

@Injectable()
export class MoviesService {
  private apiUrl: string;
  private bearerToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiUrl = process.env.API_URL ?? '';
    this.bearerToken = process.env.BEARER_TOKEN ?? '';
    ;

    console.log("this.apiUrl", this.apiUrl);
    console.log("this.bearerToken", this.bearerToken);

  }

  async getMovies(queryParams: any): Promise<any> {
      const { page, query } = queryParams;

      if (query != null && query != ""){
        const response = await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/search/movie`, {
              params: { page, query },
              headers: {
                Authorization: `Bearer ${this.bearerToken}`,
              },
            })
          );
          return response.data;
      }
      else{
        const response = await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/movie/now_playing`, {
              params: { page },
              headers: {
                Authorization: `Bearer ${this.bearerToken}`,
              },
            })
          );
          return response.data;
      }

      

      
  }
}