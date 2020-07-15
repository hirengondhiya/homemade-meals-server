const mongoose = require("mongoose");
const expect = require("expect");
const utilities = require("../utilities/menu-utility");
const Menu = require("../models/menu");
const { connectTestDB, disconnectTestDb } = require("./config");

describe("Menu Utility", () => {
  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await disconnectTestDb();
  });

  beforeEach(async () => {
    const menu = new Menu({
      title: "menu item 1",
      description: "menu item decription",
      deliversOn: new Date(),
      orderStarts: new Date(),
      orderEnds: new Date(),
      maxOrders: 20,
      cost: 1500,
    });
    await menu.save();
    console.log(menu._id);
  });

  describe("getMenu", () => {
    it("should get all the menus", async function () {
      let req = {
        query: {},
      };
      await utilities.getMenu(req).exec((err, menus) => {
        expect(Object.keys(menus).length).toBe(1);
      });
    });
    it("maxOrders should be 20", async function () {
      let req = {
        query: {},
      };
      await utilities.getMenu(req).exec((err, menus) => {
        expect(menus[0].maxOrders).toBe(20);
      });
    });
  });

  afterEach(async () => {
    await mongoose.connection.db.dropCollection("menus");
  });
});
