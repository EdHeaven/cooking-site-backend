import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  ingredients: string[];

  @Prop({ required: true })
  instructions: string[];

  @Prop()
  imageUrl: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
