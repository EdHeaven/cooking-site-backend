import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CuisineDocument =  Cuisine & Document;

@Schema()
export class  Cuisine {
  @Prop({ required: true })
  name: string;
}

export const CuisineSchema = SchemaFactory.createForClass(Cuisine);
