import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IngredientDocument = Ingredient & Document;

@Schema()
export class Ingredient {
  @Prop({ required: true, unique: true })
  name: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
