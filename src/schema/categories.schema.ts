import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ schemaOptions: { collection: 'categories' } })
export class CategorySchema {
  @Prop({ auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({ default: null })
  rank: number;
}
