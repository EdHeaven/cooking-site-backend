import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Ingredient } from '../ingredient/ingredient.schema';
import * as mongoose from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }] })
  ingredients: mongoose.Types.ObjectId[] | Ingredient[];
  
  @Prop({ required: true })
  instructions: string;

  @Prop({ default: " " })
  imageUrl: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likedBy: mongoose.Types.ObjectId[];  // Добавлен новый массив

  @Prop({ default: 0 }) // изменение типа и добавление значения по умолчанию для likes
  likes: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
