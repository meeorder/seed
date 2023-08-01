import { modelOptions, Prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { collection: 'tables' },
})
export class TablesSchema {
  @Prop({ type: Number, required: true })
  _id: number;
}
