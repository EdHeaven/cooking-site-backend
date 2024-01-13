import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.schema';
import { Types } from 'mongoose';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get('searchByIngredients')
  searchByIngredients(@Query('ingredients') ingredients: string) {
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim());
    return this.recipesService.findByIngredients(ingredientsArray);
  }  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  create(@Body() recipe: Recipe) {
    return this.recipesService.create(recipe);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() recipe: Recipe) {
    return this.recipesService.update(id, recipe);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
