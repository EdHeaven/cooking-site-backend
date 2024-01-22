import { Controller, Get, Param, Post, Body, Put, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.schema';
import { Types } from 'mongoose';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';


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
  
  @Post(':id/like')
  async likeRecipe(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.likeRecipe(id);
  }

  @Get(':id/likes')
  async getLikesCount(@Param('id') id: string): Promise<{ likes: number }> {
    const likes = await this.recipesService.getLikesCount(id);
    return { likes };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }
  
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() recipe: Recipe, @UploadedFile() imageFile: Express.Multer.File) {
    return this.recipesService.create(recipe, imageFile);
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
