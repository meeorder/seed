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
  await mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017', {
    dbName: process.env.MONGO_DB_NAME ?? 'meeorder',
  });

  /////////////////////////////////// DROP DATABASE  ///////////////////////////////////
  await mongoose.connection.db.dropDatabase();

  /////////////////////////////////// INSERT TABLE  ///////////////////////////////////
  await tableModel.insertMany(
    Array.from({ length: 10 }, (_, i) => i + 1).map((i) => ({ _id: i })),
  );

  /////////////////////////////////// INSERT ADDON  ///////////////////////////////////
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

  const mainCategoryId = new Types.ObjectId(3000);
  const dessertCategoryId = new Types.ObjectId(3001);
  const fruitCategoryId = new Types.ObjectId(3002);
  const drinkCategoryId = new Types.ObjectId(3003);
  const otherCategoryId = new Types.ObjectId(3004);

  /////////////////////////////////// INSERT MENU  ///////////////////////////////////

  const mainFoodNames = [
    'ข้าวผัดกะเพราหมูกรอบ',
    'ข้าวไข่เจียวหมูสับ',
    'ข้าวผัดหมู',
    'ข้าวผัดกุ้ง',
    'ข้าวผัดกุ้งทะเล',
    'ข้าวผัดปู',
    'ไก่ผัดกระเทียม',
    'หมูผัดกระเทียม',
    'หมูผัดพริกเผา',
  ];

  const dessertFoodNames = [
    'ข้าวเหนียวมะม่วง',
    'ข้าวเหนียวทุเรียน',
    'ข้าวเหนียวสังขยา',
    'ไอศกรีม',
    'เครป',
    'เครปชีส',
    'เครปสตรอเบอร์รี่',
    'เครปช็อคโกแลต',
  ];

  const fruitFoodNames = [
    'มะละกอ',
    'มะม่วง',
    'ทุเรียน',
    'ส้ม',
    'ส้มโอ',
    'แตงโม',
    'กล้วย',
  ];

  const drinkFoodNames = [
    'น้ำเปล่า',
    'น้ำอัดลม',
    'น้ำส้ม',
    'โค้ก',
    'ชา',
    'ชาเย็น',
    'ชานม',
    'ชามะนาว',
  ];

  const otherFoodNames = ['ถั่วทอด', 'ไข่ต้ม', 'ไข่เยี่ยวม้า', 'น้ำพริก'];

  const mainFoodIds = mainFoodNames.map(
    (name, idx) => new Types.ObjectId(3500 + idx),
  );
  const dessertFoodIds = dessertFoodNames.map(
    (name, idx) => new Types.ObjectId(3600 + idx),
  );
  const fruitFoodIds = fruitFoodNames.map(
    (name, idx) => new Types.ObjectId(3700 + idx),
  );
  const drinkFoodIds = drinkFoodNames.map(
    (name, idx) => new Types.ObjectId(3800 + idx),
  );
  const otherFoodIds = otherFoodNames.map(
    (name, idx) => new Types.ObjectId(3900 + idx),
  );

  await menuModel.insertMany([
    ...mainFoodNames.map((name, i) => ({
      _id: mainFoodIds[i],
      addons: addOnsIds,
      category: mainCategoryId,
      description: name + ' อร่อยมาก' + i + ' อร่อยมาก' + i + ' อร่อยมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&main&${i}`,
      name,
      price: 35 + i * 5,
      published_at: new Date(),
    })),
    ...dessertFoodNames.map((name, i) => ({
      _id: dessertFoodIds[i],
      addons: addOnsIds,
      category: dessertCategoryId,
      description: name + ' หวานมาก' + i + ' หวานมาก' + i + ' หวานมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&dessert&${i}`,
      name,
      price: 10 + i * 2,
      published_at: new Date(),
    })),
    ...fruitFoodNames.map((name, i) => ({
      _id: fruitFoodIds[i],
      addons: addOnsIds,
      category: fruitCategoryId,
      description: name + ' กรอบมาก' + i + ' กรอบมาก' + i + ' กรอบมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&fruit&${i}`,
      name,
      price: 20 + i * 3,
      published_at: new Date(),
    })),
    ...drinkFoodNames.map((name, i) => ({
      _id: drinkFoodIds[i],
      addons: addOnsIds,
      category: drinkCategoryId,
      description:
        name + ' สดชื่นมาก' + i + ' สดชื่นมาก' + i + ' สดชื่นมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&drink&${i}`,
      name,
      price: 10 + i * 2,
      published_at: new Date(),
    })),
    ...otherFoodNames.map((name, i) => ({
      _id: otherFoodIds[i],
      addons: addOnsIds,
      category: otherCategoryId,
      description: name + ' อร่อยมาก' + i + ' อร่อยมาก' + i + ' อร่อยมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&other&${i}`,
      name,
      price: 10 + i * 2,
      published_at: new Date(),
    })),
  ]);

  /////////////////////////////////// INSERT CATEGORY  ///////////////////////////////////

  await categoriesModel.insertMany([
    {
      title: 'คาว',
      description: 'อาหารคาว',
      rank: 0,
      menus: mainFoodIds,
      _id: mainCategoryId,
    },
    {
      title: 'หวาน',
      description: 'อาหารหวาน',
      rank: 1,
      menus: dessertFoodIds,
      _id: dessertCategoryId,
    },
    {
      title: 'ผลไม้',
      description: 'ผลไม้',
      rank: 2,
      menus: fruitFoodIds,
      _id: fruitCategoryId,
    },
    {
      title: 'เครื่องดื่ม',
      description: 'เครื่องดื่ม',
      rank: 3,
      menus: drinkFoodIds,
      _id: drinkCategoryId,
    },
    {
      title: 'อื่นๆ',
      description: 'อื่นๆ',
      rank: 4,
      menus: otherFoodIds,
      _id: otherCategoryId,
    },
  ]);

  /////////////////////////////////// INSERT SESSION  ///////////////////////////////////

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

  await mongoose.disconnect();
}
bootstrap();
