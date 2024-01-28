import { Controller, Get, Put, Delete, Patch, UseGuards, Request, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Recipe } from '../recipe/recipe.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard())
  @Get('/profile')
  async getProfile(@Request() req: any): Promise<{ name: string, surname: string, email: string }> {
    const userId = req.user.id;
    const user = await this.userService.getUserProfile(userId);

    return {
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
  }

  @UseGuards(AuthGuard())
  @Patch('/profile')
  async updateProfile(@Request() req: any, @Body() updateData: { name?: string, surname?: string }): Promise<{ message: string }> {
    const userId = req.user.id;
    const result = await this.userService.updateProfile(userId, updateData);
    return result;
  }

  @UseGuards(AuthGuard())
  @Put('/addToFavorites/:recipeId')
  async addToFavorites(@Request() req: any, @Param('recipeId') recipeId: string): Promise<{ message: string }> {
    const userId = req.user.id;
    const result = await this.userService.addToFavorites(userId, recipeId);
    return result;
  }

  @UseGuards(AuthGuard())
  @Delete('/removeFromFavorites/:recipeId')
  async removeFromFavorites(@Request() req: any, @Param('recipeId') recipeId: string): Promise<{ message: string }> {
    const userId = req.user.id;
    const result = await this.userService.removeFromFavorites(userId, recipeId);
    return result;
  }

  @UseGuards(AuthGuard())
  @Get('/favoriteRecipes')
  async getFavoriteRecipes(@Request() req: any): Promise<Recipe[]> {
    const userId = req.user.id;
    return await this.userService.getFavoriteRecipes(userId);
  }

  @UseGuards(AuthGuard())
  @Get('/likedRecipes')
  async getLikedRecipes(@Request() req: any): Promise<{ likedRecipeIds: string[] }> {
    const userId = req.user.id;
    const likedRecipeIds = await this.userService.getLikedRecipeIds(userId);
    return { likedRecipeIds };
  }
}
