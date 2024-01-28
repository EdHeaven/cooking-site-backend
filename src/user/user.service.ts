import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Recipe } from '../recipe/recipe.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
  ) {}

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: { name?: string, surname?: string, newPassword?: string }): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.name) {
      user.name = updateData.name;
    }

    if (updateData.surname){
      user.surname = updateData.surname
    }

    await user.save();

    return { message: 'Profile updated successfully' };
  }

  async addToFavorites(userId: string, recipeId: string): Promise<{message: string,}> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recipe = await this.recipeModel.findById(recipeId);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const objectIdRecipeId = new Types.ObjectId(recipeId);

    if (!user.favoriteRecipes.includes(objectIdRecipeId)) {
      user.favoriteRecipes.push(objectIdRecipeId);
      await user.save();
    }

    return {message: "Recipe added",}
  }

  async removeFromFavorites(userId: string, recipeId: string): Promise<{message: string,}> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recipe = await this.recipeModel.findById(recipeId);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    user.favoriteRecipes = user.favoriteRecipes.filter((favRecipeId) => favRecipeId.toString() !== recipeId);
    await user.save();

    return {message: "Recipe removed",}
  }

  async getFavoriteRecipes(userId: string): Promise<Recipe[]> {
    try {
      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const favoriteRecipeIds = user.favoriteRecipes as Types.ObjectId[];

      // Запрос на получение рецептов по каждому идентификатору
      const favoriteRecipes = await Promise.all(
        favoriteRecipeIds.map(async (recipeId) => {
          const recipe = await this.recipeModel.findById(recipeId).exec();
          return recipe;
        })
      );

      return favoriteRecipes.filter(Boolean) as Recipe[]; // Фильтрация null, если что-то пошло не так
    } catch (error) {
      console.error('Error when retrieving favorite recipes:', error);
      return [];
    }
  }

  async getLikedRecipeIds(userId: string): Promise<string[]> {
    try {
      const likedRecipeIds = await this.recipeModel.distinct('_id', { likedBy: userId }).exec();
      return likedRecipeIds.map((id) => id.toString());
    } catch (error) {
      console.error('Error when retrieving liked recipe IDs:', error);
      return [];
    }
  }
}
