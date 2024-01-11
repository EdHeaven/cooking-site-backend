import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findAll() {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string) {
    return this.recipeModel.findById(id).exec();
  }
}
