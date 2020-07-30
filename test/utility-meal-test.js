require("./helpers/config");
const mongoose = require("mongoose");
const expect = require("expect");
const utilities = require("../utilities/meal-utility");
const Meal = require("../models/meal");
const { connectDb, disconnectDb } = require("../db/connect-db");
const {
  createMealAcceptingOrder,
  createMealOrderClosed,
  createMealOrdersNotOpened,
  createMealWithSeller,
  findOrCreateSeller,
} = require("./helpers/meal-data-helper");

// global variable
let mealID;

describe("Meal Utility", () => {
  before(async () => {
    await connectDb();
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await disconnectDb();
  });

  beforeEach(async () => {
    const meal = new Meal({
      title: "meal item 1",
      description: "meal item decription",
      deliversOn: new Date(),
      orderStarts: new Date(),
      orderEnds: new Date(),
      maxOrders: 20,
      cost: 1500,
    });
    let data = await meal.save();
    mealID = data._id;
  });

  //   get all the meals
  describe("getMeal", () => {
    it("should get all the meals", async () => {
      let req = {
        query: {},
      };
      const meals = await utilities.getMeal(req).exec();
      expect(Object.keys(meals).length).toBe(1);
    });
    it("maxOrders should be 20", async () => {
      let req = {
        query: {},
      };
      const meals = await utilities.getMeal(req).exec();
      expect(meals[0].maxOrders).toBe(20);
    });
  });

  // get meal by id

  describe("getMealById", () => {
    it("title should be meal item 1", async () => {
      let req = {
        params: {
          id: mealID,
        },
      };
      const meal = await utilities.getMealById(req.params.id).exec();
      expect(meal.title).toBe("meal item 1");
    });
  });

  // create new meal
  describe("createMeal", () => {
    it("should create a new post", async () => {
      let req = {
        body: {
          title: "meal item 2",
          description: "meal item decription",
          deliversOn: new Date(),
          orderStarts: new Date(),
          orderEnds: new Date(),
          maxOrders: 15,
          cost: 20,
        },
      };
      const meal = await utilities.createMeal(req.body).save();
      expect(meal.title).toBe("meal item 2");
    });
    it("should remove whitesapce in the user input data", async () => {
      let newMeal = {
        title: "   meal item 2",
        description: "meal item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 15,
        cost: 20,
      };
      const meal = await utilities.createMeal(newMeal).save();
      expect(meal.title).toBe("meal item 2");
    });
  });

  // delete meal with id
  describe("deleteMealById", () => {
    it("should delete the specific meal with id", async () => {
      let req = {
        params: {
          id: mealID,
        },
      };
      await utilities.deleteMealById(req.params.id).exec();
      const meal = await utilities.getMealById(req.params.id).exec();
      expect(meal).toBe(null);
    });
  });

  // update Meal
  describe("updateMealByID", () => {
    it("should update the specified meal with id", async () => {
      expect.assertions(1);
      let mealUpdates = {
        title: "updated meal",
        description: "meal item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 15,
        cost: 20,
      };

      const meal = await utilities.updateMealById(mealID, mealUpdates).exec();
      expect(meal.title).toBe("updated meal");
    });
  });

  describe("getMealsAccpetingOrders", () => {
    it("should return no meals when there is no meal accepting orders", async () => {
      await createMealOrderClosed();
      await createMealOrdersNotOpened();
      const meals = await utilities.getMealsAccpetingOrders();

      expect(meals.length).toBe(0);
    });
    it("should return meal accepting orders", async () => {
      const mealAcceptingOrder = await createMealAcceptingOrder();
      // console.log(mealAcceptingOrder)
      const meals = await utilities.getMealsAccpetingOrders();
      // console.log(meals)
      expect(meals.length).toBe(1);
      expect(meals[0]._id.toString()).toBe(mealAcceptingOrder._id.toString());
    });
  });

  describe("getMealsSoldBy", () => {
    beforeEach(async () => {
      await createMealWithSeller();
    });
    it("should return all meals sold by a seller", async () => {
      const seller = await findOrCreateSeller();
      const meals = await utilities.getMealsSoldBy(seller._id);
      expect(meals.length).toBe(1);
    });
  });

  describe("getMealSoldBy", () => {
    beforeEach(async () => {
      const meal = await createMealWithSeller();
      mealID = meal._id;
    });
    it("should return the meal by a seller", async () => {
      const seller = await findOrCreateSeller();
      const meal = await utilities.getMealSoldBy(seller._id, mealID);
      expect(meal._id.toString()).toBe(mealID.toString());
    });
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("meals");
  });
});
