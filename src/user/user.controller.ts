import { Controller, Get, UseGuards, Request, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get('/profile')
  async getProfile(@Request() req: any): Promise<{ name: string, email: string }> {
    const userId = req.user.id;
    const user = await this.userService.getUserProfile(userId);

    return {
      name: user.name,
      email: user.email,
    };
  }

  @UseGuards(AuthGuard())
  @Patch('/profile')
  async updateProfile(@Request() req: any, @Body() updateData: { name?: string }): Promise<{ message: string }> {
    const userId = req.user.id;
    const result = await this.userService.updateProfile(userId, updateData);
    return result;
  }
}
