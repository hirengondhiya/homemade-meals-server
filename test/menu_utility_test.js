const mongoose = require("mongoose");
const expect = require("expect");
const utilities = require("../utilities/menu-utility");
const Menu = require("../models/menu");
const { connectTestDB, disconnectTestDb } = require("./config");

// global variable
let menuID;

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
    let data = await menu.save();
    menuID = data._id;
  });

  //   get all the menus
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

  // get menu by id

  describe("getMenuById", () => {
    it("title should be menu item 1", async function () {
      let req = {
        params: {
          id: menuID,
        },
      };
      await utilities.getMenuById(req.params.id).exec((err, menu) => {
        expect(menu.title).toBe("menu item 1");
      });
    });
  });

  // create new menu
  describe("createMenu", () => {
    it("should create a new post", async function () {
      let req = {
        body: {
          title: "menu item 2",
          description: "menu item decription",
          deliversOn: new Date(),
          orderStarts: new Date(),
          orderEnds: new Date(),
          maxOrders: 15,
          cost: 20,
        },
      };
      await utilities.createMenu(req.body).save((err, menu) => {
        expect(menu.title).toBe("menu item 2");
      });
    });
    it("should remove whitesapce in the user input data", async function () {
      let newMenu = {
        title: "   menu item 2",
        description: "menu item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 15,
        cost: 20,
      };
      await utilities.createMenu(newMenu).save((err, menu) => {
        expect(menu.title).toBe("menu item 2");
      });
    });
  });

  // delete menu with id
  describe("deleteMenuById", () => {
    it("should delete the specific menu with id", async function () {
      let req = {
        params: {
          id: menuID,
        },
      };
      await utilities.deleteMenuById(req.params.id).exec();
      await utilities.getMenuById(req.params.id).exec((err, menu) => {
        expect(menu).toBe(null);
      });
    });
  });

  // update Menu
  describe("updateMenuByID", () => {
    it("should update the specified menu with id", async function () {
      let menuUpdates = {
        title: "updated menu",
        description: "menu item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 15,
        cost: 20,
      };
      await utilities.updateMenuById(menuID, menuUpdates).exec((err, menu) => {
        expect(menu.title).toBe("updated menu");
      });
    });
  });

  afterEach(async () => {
    await mongoose.connection.db.dropCollection("menus");
  });
});
