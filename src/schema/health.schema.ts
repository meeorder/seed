import { modelOptions, Prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'healths' },
})
export class HealthSchema {
  _id: Types.ObjectId;

  id?: string;

  @Prop({ name: 'created_at', default: new Date() })
  createdAt: Date;
}
