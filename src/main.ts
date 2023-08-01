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

  await mongoose.connection.db.dropDatabase();

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

  const mainCategoryId = new Types.ObjectId(3000);
  const dessertCategoryId = new Types.ObjectId(3001);
  const fruitCategoryId = new Types.ObjectId(3002);
  const drinkCategoryId = new Types.ObjectId(3003);
  const otherCategoryId = new Types.ObjectId(3004);
  await categoriesModel.insertMany([
    {
      title: 'คาว',
      description: 'อาหารคาว',
      _id: mainCategoryId,
    },
    {
      title: 'หวาน',
      description: 'อาหารหวาน',
      _id: dessertCategoryId,
    },
    {
      title: 'ผลไม้',
      description: 'ผลไม้',
      _id: fruitCategoryId,
    },
    {
      title: 'เครื่องดื่ม',
      description: 'เครื่องดื่ม',
      _id: drinkCategoryId,
    },
    {
      title: 'อื่นๆ',
      description: 'อื่นๆ',
      _id: otherCategoryId,
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

  await menuModel.insertMany([
    ...mainFoodNames.map((name, i) => ({
      addons: addOnsIds,
      category: mainCategoryId,
      description: name + ' อร่อยมาก' + i + ' อร่อยมาก' + i + ' อร่อยมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&main&${i}`,
      name,
      price: 35 + i * 5,
      rank: i,
      published_at: new Date(),
    })),
    ...dessertFoodNames.map((name, i) => ({
      addons: addOnsIds,
      category: dessertCategoryId,
      description: name + ' หวานมาก' + i + ' หวานมาก' + i + ' หวานมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&dessert&${i}`,
      name,
      price: 10 + i * 2,
      rank: i,
      published_at: new Date(),
    })),
    ...fruitFoodNames.map((name, i) => ({
      addons: addOnsIds,
      category: fruitCategoryId,
      description: name + ' กรอบมาก' + i + ' กรอบมาก' + i + ' กรอบมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&fruit&${i}`,
      name,
      price: 20 + i * 3,
      rank: i,
      published_at: new Date(),
    })),
    ...drinkFoodNames.map((name, i) => ({
      addons: addOnsIds,
      category: drinkCategoryId,
      description:
        name + ' สดชื่นมาก' + i + ' สดชื่นมาก' + i + ' สดชื่นมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&drink&${i}`,
      name,
      price: 10 + i * 2,
      rank: i,
      published_at: new Date(),
    })),
    ...otherFoodNames.map((name, i) => ({
      addons: addOnsIds,
      category: otherCategoryId,
      description: name + ' อร่อยมาก' + i + ' อร่อยมาก' + i + ' อร่อยมาก' + i,
      image: `https://source.unsplash.com/random/?food&plate&other&${i}`,
      name,
      price: 10 + i * 2,
      rank: i,
      published_at: new Date(),
    })),
  ]);

  await mongoose.disconnect();
}
bootstrap();
