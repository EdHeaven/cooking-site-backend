import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string, statusCode: number, token?: string }> {
    const { name, surname, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await this.userModel.create({
        name,
        surname,
        email,
        password: hashedPassword,
        isVerified: false,
      });
  
      const token = this.jwtService.sign({ id: user._id });
    
      return { message: 'Registration completed successful', statusCode: 201};
    } catch (error) {
      console.error('Error during sign-up:', error);
      return { message: 'Error: Registration failed', statusCode: 500 };
    }
  }  

  async login(loginDto: LoginDto): Promise<{ token: string, statusCode: number }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token, statusCode: 201 };
  }
}
