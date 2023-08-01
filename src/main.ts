import { DocumentType, getModelForClass } from '@typegoose/typegoose';
import { AddonSchema } from './schema/addons.schema';
import { CategorySchema } from './schema/categories.schema';
import { MenuSchema } from './schema/menus.schema';
import { SessionSchema } from './schema/session.schema';
import { TablesSchema } from './schema/tables.schema';
import mongoose, { Types } from 'mongoose';
import { v4 } from 'uuid';

const addonModel = getModelForClass(AddonSchema);
const categoriesModel = getModelForClass(CategorySchema);
const menuModel = getModelForClass(MenuSchema);
const sessionModel = getModelForClass(SessionSchema);
const tableModel = getModelForClass(TablesSchema);

async function bootstrap() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DBNAME,
  });

  await addonModel.deleteMany({}).exec();

  const addonDocs: DocumentType<AddonSchema>[] = await addonModel.create(
    {
      title: 'เบคอน',
      price: 3,
    },
    {
      title: 'ไข่ดาว',
      price: 2,
    },
    {
      title: 'ไข่เจียว',
      price: 1,
    },
    {
      title: 'ไข่ต้ม',
      price: 1,
    },
    {
      title: 'ไข่เยี่ยวม้า',
      price: 1,
    },
    {
      title: 'ม้าลาย',
      price: 10,
    },
  );

  const addOnsIds = addonDocs.map((doc) => doc._id);
  await categoriesModel.deleteMany({}).exec();
  await categoriesModel.insertMany([
    {
      title: 'คาว',
      description: 'อาหารคาว',
      _id: new Types.ObjectId(3000),
    },
    {
      title: 'หวาน',
      description: 'อาหารหวาน',
      _id: new Types.ObjectId(3001),
    },
  ]);

  await tableModel.insertMany(
    Array.from({ length: 10 }, (_, i) => i + 1).map((i) => ({ _id: i })),
  );

  await sessionModel.deleteMany({}).exec();
  await sessionModel.insertMany([
    {
      table: 1,
      uid: v4(),
      finished_at: new Date(1),
      _id: new Types.ObjectId(1),
    },
    {
      table: 2,
      uid: v4(),
      finished_at: new Date(100),
      _id: new Types.ObjectId(99),
    },
    {
      table: 1,
      uid: null,
      finished_at: new Date(103),
      _id: new Types.ObjectId(100),
    },
  ]);

  await menuModel.deleteMany({}).exec();
  await menuModel.insertMany([
    {
      addons: addOnsIds,
      category: new Types.ObjectId(3000),
      description: 'ข้าวผัดกะเพราหมูกรอบ',
      image: 'https://source.unsplash.com/random/?food&plate&11',
      name: 'ข้าวผัดกะเพราหมูกรอบ',
      price: 35,
      rank: 1,
      published_at: new Date(),
    },
    {
      addons: addOnsIds,
      category: new Types.ObjectId(3000),
      description: 'ข้าวไข่เจียวหมูสับ',
      image: 'https://source.unsplash.com/random/?food&plate&12',
      name: 'ข้าวไข่เจียวหมูสับ',
      price: 35,
      rank: 2,
      published_at: null,
    },
    {
      addons: addOnsIds.slice(0, 3),
      category: new Types.ObjectId(3001),
      description: 'ข้าวเหนียวมะม่วง',
      image: 'https://source.unsplash.com/random/?food&plate&13',
      name: 'ข้าวเหนียวมะม่วง',
      price: 100,
      rank: null,
      published_at: new Date(),
    },
  ]);

  await mongoose.disconnect();
}
bootstrap();
