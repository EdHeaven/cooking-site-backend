import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { Ingredient, IngredientSchema } from './ingredient.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientSchema }])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
