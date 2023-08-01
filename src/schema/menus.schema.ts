import { modelOptions, Prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'menus' },
})
export class MenuSchema {
  @Prop({ auto: true })
  _id: Types.ObjectId;

  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  category: Types.ObjectId;

  @Prop({ default: null })
  rank: number;

  @Prop({ ref: () => MenuSchema })
  addons: Ref<MenuSchema>[];

  @Prop({ default: null })
  published_at: Date;

  @Prop({ default: null })
  deleted_at: Date;
}
