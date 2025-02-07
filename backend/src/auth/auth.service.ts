import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from './entities/user.entity';

@Injectable()
export class AuthService {
  private users: Users[] = [];

  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService
  ) {}
  
  async register(data: { email: string; password: string }) {
    const userExists = await this.userRepository.findOne({ where: { email: data.email } });
    if (userExists) throw new BadRequestException('Utilisateur déjà existant');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = this.userRepository.create({ email: data.email, password: hashedPassword });

    await this.userRepository.save(newUser);
    return { message: 'Inscription réussie' };
  }
  
  async login(data: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('Identifiants incorrects');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Identifiants incorrects');

    const token = this.jwtService.sign({ email: user.email, id: user.id });

  return { token, userId: user.id };
  }

}
