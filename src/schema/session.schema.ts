import { Prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { TablesSchema } from './tables.schema';

@modelOptions({
  schemaOptions: {
    collection: 'sessions',
  },
})
export class SessionSchema {
  @Prop({ auto: true })
  _id: Types.ObjectId;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: null })
  finished_at: Date;

  @Prop({ default: null })
  uid: string;

  @Prop({ required: true, ref: () => TablesSchema, type: Number })
  table: Ref<TablesSchema, number>;

  @Prop({ default: null })
  deleted_at: Date;
}
