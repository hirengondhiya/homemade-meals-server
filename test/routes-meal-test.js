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
  getCred,
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
const Meal = require("../models/meal");
const User = require("../models/user");
let meal;
const modifiedMealData = {
  title: "modified meal title",
  description: "modified desc",
};

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
  describe("GET /meals", () => {
    describe("for seller1", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return all meals sold by seller1", async () => {
        const { body: meals } = await agent
          .get("/meals")
          .expect(200)
          .expect("Content-Type", /json/);

        const mealProps = Object.keys(mealData);
        meals.forEach((meal) => {
          mealProps.forEach((prop) => expect(meal).toHaveProperty(prop));
          expect(meal).toHaveProperty("soldBy.username", sellerData.username);
        });
      });
      it("meals should have orders data", async () => {
        const { body: meals } = await agent
          .get("/meals")
          .expect(200)
          .expect("Content-Type", /json/);

        meals.forEach((meal) => {
          expect(meal).toHaveProperty("orders");
        });
      });
    });
    describe("for seller2", () => {
      beforeEach(async () => {
        const seller2Data = { ...sellerData, username: "seller2" };
        await createSeller(seller2Data);
        await login(agent, getCred(seller2Data));
      });
      it("should return empty meals array", async () => {
        const { body: meals } = await agent
          .get("/meals")
          .expect(200)
          .expect("Content-Type", /json/);
        expect(meals).toHaveLength(0);
      });
    });
    describe("for buyer", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return 403", async () => {
        await agent.get("/meals").expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403", async () => {
        await api.get("/meals").expect(403);
      });
    });
  });
  describe("POST /meals", () => {
    describe("for seller", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should create meal", async () => {
        const { body: meal } = await agent
          .post("/meals")
          .set("content-type", "application/json")
          .send(mealData)
          .expect(201)
          .expect("Content-Type", /json/);

        const mealProps = Object.keys(mealData);
        mealProps.forEach((prop) => expect(meal).toHaveProperty(prop));
      });
      it("should have property soldBy with value of seller details", async () => {
        const { body: meal } = await agent
          .post("/meals")
          .set("content-type", "application/json")
          .send(mealData)
          .expect(201)
          .expect("Content-Type", /json/);

        expect(meal).toHaveProperty("soldBy.username", sellerData.username);
      });
    });
    describe("for buyer", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return 403", async () => {
        await agent
          .post("/meals")
          .set("content-type", "application/json")
          .send(mealData)
          .expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403", async () => {
        await api
          .post("/meals")
          .set("content-type", "application/json")
          .send(mealData)
          .expect(403);
      });
    });
  });
  describe("GET /meals/:id", () => {
    beforeEach(async () => {
      const seller = await User.findOne({ username: sellerData.username });
      meal = await Meal.findOne({ soldBy: seller._id });
      // console.log(meal)
    });
    describe("for seller1", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return meal by id", async () => {
        const { body } = await agent
          .get(`/meals/${meal._id.toString()}`)
          .expect(200)
          .expect("Content-Type", /json/);

        const mealProps = Object.keys(mealData);
        mealProps.forEach((prop) => expect(body).toHaveProperty(prop));
        expect(body).toHaveProperty("soldBy.username", sellerData.username);
      });
      it("meal should have order data", async () => {
        const { body } = await agent
          .get(`/meals/${meal._id.toString()}`)
          .expect(200)
          .expect("Content-Type", /json/);

        const mealProps = Object.keys(mealData);
        mealProps.forEach((prop) => expect(body).toHaveProperty(prop));
        expect(body).toHaveProperty("soldBy.username", sellerData.username);
      });
      it("should return 404 when meal not found", async () => {
        const { body } = await agent
          .get(`/meals/${mongoose.Types.ObjectId().toString()}`)
          .expect(404)
          .expect("Content-Type", /json/);
        expect(body).toHaveProperty("errMsg");
        expect(body.errMsg).toMatch(/Meal not found/);
      });
      it("should return 400 for integer meal id", async () => {
        await agent.get(`/meals/1`).expect(400);
      });
    });
    describe("for seller2", () => {
      beforeEach(async () => {
        const seller2Data = { ...sellerData, username: "seller2" };
        await createSeller(seller2Data);
        await login(agent, getCred(seller2Data));
      });
      it("should return 403 when meal is not created by logged in seller", async () => {
        await agent.get(`/meals/${meal._id.toString()}`).expect(403);
      });
    });
    describe("for buyer", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return 403 when logged in user is not a seller", async () => {
        await agent.get(`/meals/${meal._id.toString()}`).expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403 when user is not authenticated", async () => {
        await api.get(`/meals/${meal._id.toString()}`).expect(403);
      });
    });
  });
  describe("PUT /meals/:id", () => {
    beforeEach(async () => {
      const seller = await User.findOne({ username: sellerData.username });
      meal = await Meal.findOne({ soldBy: seller._id });
      // console.log(meal, seller)
    });
    describe("for seller1", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should update meal by id", async () => {
        const { body } = await agent
          .put(`/meals/${meal._id.toString()}`)
          .set("content-type", "application/json")
          .send(modifiedMealData)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body).toBeDefined();
        const mealProps = Object.keys(mealData);
        mealProps.forEach((prop) => expect(body).toHaveProperty(prop));
        expect(body).toHaveProperty("soldBy.username", sellerData.username);
      });
      it("should return 404 when meal not found", async () => {
        const { body } = await agent
          .put(`/meals/${mongoose.Types.ObjectId().toString()}`)
          .set("content-type", "application/json")
          .send(modifiedMealData)
          .expect(404)
          .expect("Content-Type", /json/);
        expect(body).toHaveProperty("errMsg");
        expect(body.errMsg).toMatch(/Meal not found/);
      });
      it("should return 400 for integer meal id", async () => {
        await agent.put(`/meals/1`).expect(400);
      });
    });
    describe("for seller2", () => {
      beforeEach(async () => {
        const seller2Data = { ...sellerData, username: "seller2" };
        await createSeller(seller2Data);
        await login(agent, getCred(seller2Data));
      });
      it("should return 403 when updating a meal is not created by logged in seller", async () => {
        await agent
          .put(`/meals/${meal._id.toString()}`)
          .set("content-type", "application/json")
          .send(modifiedMealData)
          .expect(403);
      });
    });
    describe("for buyer", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return 403 when logged in user is not a seller", async () => {
        await agent
          .put(`/meals/${meal._id.toString()}`)
          .set("content-type", "application/json")
          .send(modifiedMealData)
          .expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403 when user is not authenticated", async () => {
        await api
          .put(`/meals/${meal._id.toString()}`)
          .set("content-type", "application/json")
          .send(modifiedMealData)
          .expect(403);
      });
    });
  });
  describe("DELETE /meals/:id", () => {
    beforeEach(async () => {
      const seller = await User.findOne({ username: sellerData.username });
      meal = await Meal.findOne({ soldBy: seller._id });
      // console.log(meal, seller)
    });
    describe("for seller1", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should delete meal by id", async () => {
        await agent.delete(`/meals/${meal._id.toString()}`).expect(204);
      });
      it("should return 404 when meal not found", async () => {
        const { body } = await agent
          .delete(`/meals/${mongoose.Types.ObjectId().toString()}`)
          .expect(404)
          .expect("Content-Type", /json/);
        expect(body).toHaveProperty("errMsg");
        expect(body.errMsg).toMatch(/Meal not found/);
      });
      it("should return 400 for integer meal id", async () => {
        await agent.delete(`/meals/1`).expect(400);
      });
    });
    describe("for seller2", () => {
      beforeEach(async () => {
        const seller2Data = { ...sellerData, username: "seller2" };
        await createSeller(seller2Data);
        await login(agent, getCred(seller2Data));
      });
      it("should return 403 when updating a meal is not created by logged in seller", async () => {
        await agent.delete(`/meals/${meal._id.toString()}`).expect(403);
      });
    });
    describe("for buyer", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return 403 when logged in user is not a seller", async () => {
        await agent.delete(`/meals/${meal._id.toString()}`).expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403 when user is not authenticated", async () => {
        await api.delete(`/meals/${meal._id.toString()}`).expect(403);
      });
    });
  });
});
