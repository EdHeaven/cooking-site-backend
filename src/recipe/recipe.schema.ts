import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ingredient' }] }) // изменение типа поля ingredients
  ingredients: Types.ObjectId[];

  @Prop({ required: true })
  instructions: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: 0 }) // изменение типа и добавление значения по умолчанию для likes
  likes: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
