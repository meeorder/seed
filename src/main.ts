import mongoose from 'mongoose';
import {
  createCategory,
  getAllCategories,
  replaceCategoryByIdAndData,
  updateCategoryRankByIds,
} from './services/categories';
import { createAddon, getAllAddons } from './services/addons';
import { createMenu, getAllMenus, publishMenuById } from './services/menus';
import { createTable, getAllTables } from './services/tables';
import { createSession, getAllSessions } from './services/sessions';
import {
  CreateOrderBodyParam,
  createOrder,
  getAllOrders,
  setOrderStatusToDoneById,
  setOrderStatusToPreparingById,
  setOrderStatusToReadyToServeById,
} from './services/orders';

async function bootstrap() {
  await mongoose.connect(
    process.env.MONGO_URI ??
      'mongodb+srv://meeorder-ku:J6MqU8xBePxMG35O@meeorder.lzavilq.mongodb.net/?authMechanism=DEFAULT',
    {
      dbName: process.env.MONGO_DB_NAME ?? 'meeorder',
    },
  );
  /////////////////////////////////// DROP DATABASE  ///////////////////////////////////
  await mongoose.connection.db
    .listCollections()
    .toArray()
    .then((collections) => {
      collections.forEach(({ name }) => {
        mongoose.connection.db.dropCollection(name);
      });
    });

  /////////////////////////////////// MENU ADDON CATEGORY ///////////////////////////////////
  const categories = [
    'อาหารจานเดียว',
    'กับข้าว',
    'เครื่องดื่ม',
    'ของหวาน',
    'ผลไม้',
    'ของทานเล่น',
    'อื่นๆ',
  ] as const;

  const createCategoryPromises = categories.map((category) =>
    createCategory({ title: category }),
  );

  console.log('try to create category');

  await Promise.all(createCategoryPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allCategories = await getAllCategories();

  if (allCategories.length !== categories.length) {
    throw new Error('create category failed');
  }

  console.log('create all categories success');

  const categoryWithId = categories.map((category) => ({
    _id: allCategories.find((c) => c.title === category)?._id,
    title: category,
  }));

  await updateCategoryRankByIds({
    rank: categoryWithId.map((data) => data._id),
  });

  const addons = ['ไข่ดาว', 'ไข่เจียว', 'ไข่ต้ม', 'ไข่เค็ม', 'ไข่เยี่ยวม้า'];

  const createAddonPromises = addons.map((addon, i) =>
    createAddon({ title: addon, price: i * 5 }),
  );

  console.log('try to create addon');

  await Promise.all(createAddonPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allAddons = await getAllAddons();

  if (allAddons.length !== addons.length) {
    throw new Error('create addon failed');
  }
  console.log('create all addons success');

  const addonWithId = addons.map((addon, index) => ({
    _id: allAddons[index]._id,
    title: addon,
  }));

  const dishes: Record<(typeof categories)[number], string[]> = {
    อาหารจานเดียว: [
      'ข้าวผัดกะเพราหมู',
      'ข้าวผัดกะเพราไก่',
      'ข้าวผัดกะเพราเนื้อ',
      'ข้าวยำไก่ย่าง',
      'ข้าวหมูทอดกระเทียม',
      'ข้าวอบหมูแดง',
    ],
    กับข้าว: [
      'กะเพราหมูกรอบ',
      'กะเพราไก่กรอบ',
      'กะเพราเนื้อกรอบ',
      'ไก่ทอด',
      'ไก่ทอดน้ำปลา',
    ],
    เครื่องดื่ม: ['น้ำเปล่า', 'น้ำอัดลม', 'น้ำผลไม้', 'น้ำส้ม', 'ชาเย็น'],
    ของหวาน: ['ขนมปัง', 'ขนมเค้ก', 'ฟรุตสลัด', 'ไอศกรีม', 'เครป'],
    ผลไม้: ['แอปเปิ้ล', 'ส้ม', 'กล้วย', 'ส้มโอ', 'มะละกอ'],
    ของทานเล่น: ['หนังไก่ทอด', 'ไส้กรอกทอด', 'เฟรนฟราย', 'เกี๊ยวทอด'],
    อื่นๆ: ['ข้าวเหนียว', 'ข้าวเปล่า', 'ขนมจีน'],
  };

  const createDishPromises = Object.entries(dishes).map(
    ([category, dishList]) =>
      Promise.all(
        dishList.map((dish, i) =>
          createMenu({
            title: dish,
            description: dish + 'description' + category,
            price: i * 5,
            category: categoryWithId.find((c) => c.title === category)?._id,
            addons: addonWithId.map((addon) => addon._id),
            image: 'https://source.unsplash.com/random/?food&plate&' + i,
          }),
        ),
      ),
  );

  console.log('try to create menu');

  await Promise.all(createDishPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allMenuList = await getAllMenus({
    status: 'all',
  });

  if (
    allMenuList.length !== categories.length ||
    allMenuList.map((categoryWithMenu) => categoryWithMenu.menus).flat()
      .length !== Object.values(dishes).flat().length
  ) {
    throw new Error('create menu failed');
  }

  console.log('create all menu success');

  const allMenu = allMenuList
    .map((categoryWithMenu) => categoryWithMenu.menus)
    .flat();

  const publishMenuPromises = allMenu.map((menu) =>
    publishMenuById({
      id: menu._id,
    }),
  );

  console.log('try to publish menu');

  await Promise.all(publishMenuPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allPublishedMenu = await getAllMenus({
    status: 'published',
  });

  if (
    allPublishedMenu.length !== categories.length ||
    allPublishedMenu.map((categoryWithMenu) => categoryWithMenu.menus).flat()
      .length !== Object.values(dishes).flat().length
  ) {
    throw new Error('publish menu failed');
  }

  console.log('publish all menu success');

  const replaceCategoryPromises = categoryWithId.map((category, idx) =>
    replaceCategoryByIdAndData({
      id: category._id,
      title: category.title,
      rank: idx,
      menus: allPublishedMenu
        .filter(
          (categoryWithMenu) => categoryWithMenu.category._id === category._id,
        )
        .map((categoryWithMenu) => categoryWithMenu.menus)
        .flat()
        .map((menu) => menu._id),
    }),
  );

  console.log('try to replace category');

  await Promise.all(replaceCategoryPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allCategory = await getAllCategories();

  if (
    allCategory.length !== categories.length ||
    allCategory.map((category) => category.menus).flat().length !==
      Object.values(dishes).flat().length
  ) {
    throw new Error('replace category failed');
  }

  console.log('replace all category success');

  const newMenu = await getAllMenus({
    status: 'published',
  });

  if (
    newMenu.length !== categories.length ||
    newMenu.map((categoryWithMenu) => categoryWithMenu.menus).flat().length !==
      Object.values(dishes).flat().length
  ) {
    throw new Error('replace category failed');
  }
  console.log('replace all menu success');

  console.log(newMenu);

  /////////////////////////////////// TABLE SESSION ORDER ///////////////////////////////////

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const createTablePromises = tableNumbers.map((tableNumber) =>
    createTable({
      _id: tableNumber,
    }),
  );

  console.log('try to create table');

  await Promise.all(createTablePromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allTable = await getAllTables();

  if (allTable.length !== tableNumbers.length) {
    throw new Error('create table failed');
  }

  console.log('create all table success');

  const newSessionTables = [1, 3, 5, 7, 9];

  const newSessionTablePromises = newSessionTables.map((tableNumber) =>
    createSession({
      table: tableNumber,
    }),
  );

  console.log('try to create session');

  await Promise.all(newSessionTablePromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allSession = await getAllSessions({
    finished: false,
  });

  if (allSession.length !== newSessionTables.length) {
    throw new Error('create session failed');
  }

  console.log('create all session success');

  console.log(allSession);

  const orderForAllSession: CreateOrderBodyParam['orders'] = [
    {
      menu: allMenu[0]._id,
      addons: [allAddons[0]._id, allAddons[1]._id],
      additional_info: 'ไม่ใส่หอมให้หน่อย',
    },
    {
      menu: allMenu[1]._id,
      addons: [allAddons[2]._id, allAddons[3]._id],
    },
    {
      menu: allMenu[2]._id,
    },
    {
      menu: allMenu[3]._id,
    },
  ];

  const createOrderPromises = allSession.map((session) =>
    createOrder({
      session: session._id,
      orders: orderForAllSession,
    }),
  );

  console.log('try to create order');

  await Promise.all(createOrderPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allOrder = await getAllOrders();

  if (allOrder.length !== allSession.length * orderForAllSession.length) {
    throw new Error('create order failed');
  }

  console.log('create all order success');

  console.log(allOrder);

  const statusForAllOrder: (typeof allOrder)[number]['status'][] = [
    'PREPARING',
    'IN_QUEUE',
    'READY_TO_SERVE',
    'DONE',
  ];

  const updateOrderPromises = allOrder.map((order, idx) =>
    [
      setOrderStatusToPreparingById,
      setOrderStatusToReadyToServeById,
      setOrderStatusToDoneById,
      () => {
        return Promise.resolve();
      },
    ][idx % 4]({
      id: order._id,
    }),
  );

  console.log('try to update order');

  await Promise.all(updateOrderPromises);

  console.log('wait 1 sec');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allUpdatedOrder = await getAllOrders();

  if (
    allUpdatedOrder.length !== allSession.length * orderForAllSession.length ||
    new Set(allUpdatedOrder.map((order) => order.status)).size !==
      statusForAllOrder.length
  ) {
    throw new Error('update order failed');
  }

  console.log('update all order success');

  console.log(allUpdatedOrder);

  await mongoose.disconnect();
}
bootstrap();
