import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string): Promise<Recipe | null> {
    return this.recipeModel.findById(id).exec();
  }

  async create(recipe: Recipe): Promise<Recipe> {
    const createdRecipe = new this.recipeModel(recipe);
    return createdRecipe.save();
  }

  async update(id: string, recipe: Recipe): Promise<Recipe> {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(id, recipe, { new: true });
    if (!updatedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return updatedRecipe;
  }

  async delete(id: string): Promise<Recipe> {
    const deletedRecipe = await this.recipeModel.findByIdAndDelete(id).lean().exec();
    if (!deletedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return deletedRecipe as Recipe;
  }
  
  async findByIngredients(ingredients: string[]): Promise<Recipe[]> {
    try {
      const ingredientObjectIds = ingredients.map((ingredientId) => new Types.ObjectId(ingredientId));
      return this.recipeModel.find({ ingredients: { $all: ingredientObjectIds } }).exec();
    } catch (error) {
      // Обработка ошибок, например, возвращение пустого массива или логгирование ошибки
      console.error('Error finding recipes by ingredients:', error);
      return [];
    }
  }
}
