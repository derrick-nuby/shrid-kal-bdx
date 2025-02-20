// file location: src/user/schemas/user.schema.ts

import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, default: { ip: '', date: null } })
  lastLogin: {
    ip: string;
    date: Date;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    const salt = await bcrypt.genSalt();
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});