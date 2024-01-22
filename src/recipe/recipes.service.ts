import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';
import * as B2 from 'backblaze-b2';

class BackblazeB2Service {
  private b2;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: '003aeac1e3f7de20000000002',
      applicationKey: 'K003GQ6B5UcX/yQzHqR9UTdT74IH99w',
      bucketId: 'fa9eda7ce19e137f87dd0e12',
      // Другие параметры конфигурации Backblaze B2
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      // Авторизация аккаунта для получения токена авторизации
      const authResponse = await this.b2.authorize();
      console.error(authResponse.data.bucketName)

      // Получение данных для загрузки файла, включая authorizationToken
      // const bucketId = this.b2.bucketId // Ваш ID бакета
      const uploadUrl = await this.b2.getUploadUrl(authResponse.data.allowed.bucketId);

      // Загрузка файла на полученный URL
      const response = await this.b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        fileName,
        data: fileBuffer,
      });
      console.error(response.data)

      // Проверка успешной загрузки файла и получение общедоступного URL-адреса
      if (response?.data?.fileId) {
        const downloadUrl = `https://f003.backblazeb2.com/file/${authResponse.data.allowed.bucketName}/${response.data.fileName}`;
        console.error(downloadUrl);
        return downloadUrl;
      } else {
        console.error('Invalid response format from B2 API:', response.data);
        throw new Error('Invalid response format from B2 API');
      }
    } catch (error) {
      console.error('Error uploading file to Backblaze B2:', error);
      throw new Error('Failed to upload file to Backblaze B2');
    }
  }
}

const backblazeB2Service = new BackblazeB2Service();

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string): Promise<Recipe | null> {
    return this.recipeModel.findById(id).exec();
  }

  async create(recipe: Recipe, imageFile: Express.Multer.File): Promise<Recipe> {
    if (imageFile) {
      try {
        const imageUrl = await backblazeB2Service.uploadFile(imageFile.buffer, imageFile.originalname);
        recipe.imageUrl = imageUrl;
      } catch (error) {
        console.error('Error uploading file to Backblaze B2:', error);
        throw new Error('Failed to upload file to Backblaze B2');
      }
    }
    
    const createdRecipe = new this.recipeModel(recipe);
    return createdRecipe.save();
  }
  

  async update(id: string, recipe: Recipe): Promise<Recipe> {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(id, recipe, { new: true });
    if (!updatedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return updatedRecipe;
  }

  async delete(id: string): Promise<Recipe> {
    const deletedRecipe = await this.recipeModel.findByIdAndDelete(id).lean().exec();
    if (!deletedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return deletedRecipe as Recipe;
  }
  
  async findByIngredients(ingredients: string[]): Promise<Recipe[]> {
    try {
      const ingredientObjectIds = ingredients.map((ingredientId) => new Types.ObjectId(ingredientId));
      return this.recipeModel.find({ ingredients: { $all: ingredientObjectIds } }).exec();
    } catch (error) {
      // Обработка ошибок, например, возвращение пустого массива или логгирование ошибки
      console.error('Error finding recipes by ingredients:', error);
      return [];
    }
  }

  async likeRecipe(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('Рецепт не найден');
    }

    // Увеличиваем счетчик лайков и сохраняем рецепт
    recipe.likes += 1;
    await recipe.save();

    return recipe;
  }

  async getLikesCount(id: string): Promise<number> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('Рецепт не найден');
    }

    return recipe.likes;
  }
}
