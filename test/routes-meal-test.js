require("./helpers/config");
const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest");
const api = request(app);
const agent = request.agent(app);
const expect = require("expect");
const {
  createSeller,
  createBuyer,
  buyerData,
  sellerData,
  login,
} = require("./helpers/routes-test-helper");
const {
  createMealAcceptingOrder,
  createMealDataWihoutOrders,
  createMealDataWithCustomerOrders,
  createMealDataWithOrders,
  createMealOrderClosed,
  createMealOrdersNotOpened,
  createMealWithSeller,
  mealData,
} = require("./helpers/meal-data-helper");
const { describe } = require("mocha");

describe("Meal Routes", () => {
  after(async () => {
    await mongoose.connection.db.dropDatabase();
    app.close();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("meals");
    await mongoose.connection.db.dropCollection("users");
  });
  beforeEach(async () => {
    await createBuyer(buyerData);
    await createSeller(sellerData);
    await createMealAcceptingOrder();
    await createMealDataWihoutOrders();
    await createMealDataWithCustomerOrders();
    await createMealDataWithOrders();
    await createMealOrderClosed();
    await createMealOrdersNotOpened();
    await createMealWithSeller();
  });
  describe("GET /meals/openfororders", () => {
    it("should return meals open for orders - unauthenticated user", async () => {
      const { body } = await api
        .get("/meals/openfororders")
        .expect(200)
        .expect("Content-Type", /json/);
      expect(body).toHaveLength(1);
      Object.keys(mealData).forEach((prop) =>
        expect(body[0]).toHaveProperty(prop)
      );
    });
    it("should not reveal orders for meals open fo rorders", async () => {
      const { body } = await api
        .get("/meals/openfororders")
        .expect(200)
        .expect("Content-Type", /json/);
      expect(body).toHaveLength(1);
      expect(body[0]).not.toHaveProperty("orders");
    });
    it("should return meals open for orders - authenticated user", async () => {
      await login(agent, buyerData);

      const { body } = await agent
        .get("/meals/openfororders")
        .expect(200)
        .expect("Content-Type", /json/);
      expect(body).toHaveLength(1);
      Object.keys(mealData).forEach((prop) =>
        expect(body[0]).toHaveProperty(prop)
      );
    });
  });
});
