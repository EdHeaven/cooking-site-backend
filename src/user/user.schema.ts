  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { Document, Types } from 'mongoose';

  export type UserDocument = User & Document;

  @Schema({
    timestamps: true,
  })
  export class User extends Document {
    @Prop()
    name: string;

    @Prop()
    surname: string;

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string;

    @Prop()
    password: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Recipe' }] })
    favoriteRecipes: Types.ObjectId[];
    
    @Prop()
    isVerified: boolean;

    @Prop()
    verificationCode: string;
  }

  export const UserSchema = SchemaFactory.createForClass(User);
