import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
      ) {}

      async getUserProfile(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
      
        if (!user) {
          throw new NotFoundException('User not found');
        } 
      
        return user;
      }
    
      async updateProfile(userId: string, updateData: { name?: string, newPassword?: string }): Promise<{ message: string }> {
        const user = await this.userModel.findById(userId);
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        if (updateData.name) {
          user.name = updateData.name;
        }
      
        await user.save();
    
        return { message: 'Profile updated successfully' };
      }
}
