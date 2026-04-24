import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestDocument = RequestEntity & Document;

@Schema({ timestamps: true })
export class RequestEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: ['billing', 'support', 'feedback', 'general'],
    default: null,
  })
  category: string | null;

  @Prop({ type: String, default: null })
  summary: string | null;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high'],
    default: null,
  })
  urgency: string | null;
}

export const RequestSchema = SchemaFactory.createForClass(RequestEntity);