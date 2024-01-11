import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ingredient, IngredientDocument } from './ingredient.schema';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name) private ingredientModel: Model<IngredientDocument>,
  ) {}

  async findAll(): Promise<Ingredient[]> {
    return this.ingredientModel.find().exec();
  }

  async findOne(id: string): Promise<Ingredient> {
    return this.ingredientModel.findById(id).exec();
  }
}
