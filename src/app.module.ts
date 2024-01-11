import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesModule } from './recipe/recipes.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IngredientsModule } from './ingredient/ingredients.module';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI),
    RecipesModule,
    AuthModule,
    UserModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
