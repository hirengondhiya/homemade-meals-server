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
  createMealDataWithCustomerOrders,
  orderData,
} = require("./helpers/meal-data-helper");
const Meal = require("../models/meal");
let meal;
let buyer;

describe("Order Routes", () => {
  after(async () => {
    await mongoose.connection.db.dropDatabase();
    app.close();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("meals");
    await mongoose.connection.db.dropCollection("users");
  });
  beforeEach(async () => {
    buyer = await createBuyer(buyerData);
    await createSeller(sellerData);
    meal = await createMealDataWithCustomerOrders();
  });

  describe("GET /orders", () => {
    describe("for buyer1", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return all orders placed by buyer1", async () => {
        const { body: mealsWithOrders } = await agent
          .get("/orders")
          .expect(200)
          .expect("Content-Type", /json/);
        const orderProps = Object.keys(orderData);
        mealsWithOrders.forEach(({ orders: [order] }) => {
          orderProps.forEach((prop) => expect(order).toHaveProperty(prop));
          expect(order).toHaveProperty("customer", buyer._id.toString());
        });
      });
      it("should return meal data associated with the order", async () => {
        const { body: mealsWithOrders } = await agent
          .get("/orders")
          .expect(200)
          .expect("Content-Type", /json/);
        const mealProps = [
          "_id",
          "cost",
          "deliversOn",
          "description",
          "mealType",
          "soldBy",
          "title",
        ];
        mealsWithOrders.forEach((meal) => {
          mealProps.forEach((prop) => expect(meal).toHaveProperty(prop));
        });
      });
    });
    describe("for buyer2", () => {
      beforeEach(async () => {
        const buyer2Data = { ...buyerData, username: "buyer2" };
        await createBuyer(buyer2Data);
        await login(agent, getCred(buyer2Data));
      });
      it("should return empty array", async () => {
        const { body: mealsWithOrders } = await agent
          .get("/orders")
          .expect(200)
          .expect("Content-Type", /json/);
        expect(mealsWithOrders).toHaveLength(0);
      });
    });
    describe("for seller", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return 403", async () => {
        await agent.get("/orders").expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403", async () => {
        await api.get("/orders").expect(403);
      });
    });
  });

  describe("POST /orders", () => {
    describe("for buyer", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should create order", async () => {
        const { body: mealWithOrder } = await agent
          .post("/orders")
          .set("content-type", "application/json")
          .send({ ...orderData, mealId: meal._id.toString() })
          .expect(201)
          .expect("Content-Type", /json/);

        const orderProps = Object.keys(orderData);
        const [order] = mealWithOrder.orders;
        orderProps.forEach((prop) => expect(order).toHaveProperty(prop));
        expect(order).toHaveProperty("customer._id", buyer._id.toString());
      });

      it("should create order for the provided meal id", async () => {
        const { body: mealWithOrder } = await agent
          .post("/orders")
          .set("content-type", "application/json")
          .send({ ...orderData, mealId: meal._id.toString() })
          .expect(201)
          .expect("Content-Type", /json/);

        expect(mealWithOrder).toHaveProperty("_id", meal._id.toString());
      });
    });
    describe("for seller", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return 403", async () => {
        await agent
          .post("/orders")
          .set("content-type", "application/json")
          .send({ ...orderData, mealId: meal._id.toString() })
          .expect(403);
      });
    });

    describe("for unauthenticated user", () => {
      it("should return 403", async () => {
        await api
          .post("/orders")
          .set("content-type", "application/json")
          .send({ ...orderData, mealId: meal._id.toString() })
          .expect(403);
      });
    });
  });

  describe("GET /orders/:id", () => {
    beforeEach(async () => {
      meal = await Meal.findOne(
        {
          "orders.customer": buyer._id.toString(),
        },
        {
          orders: {
            $elemMatch: {
              customer: buyer._id.toString(),
            },
          },
        }
      ).exec();
    });
    describe("for buyer1", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should return order by id", async () => {
        const [buyerOrder] = meal.orders;
        const { body: mealWithOrder } = await agent
          .get(`/orders/${buyerOrder._id.toString()}`)
          .expect(200)
          .expect("Content-Type", /json/);

        const orderProps = Object.keys(orderData);
        const [order] = mealWithOrder.orders;
        orderProps.forEach((prop) => expect(order).toHaveProperty(prop));
        expect(order).toHaveProperty("customer._id", buyer._id.toString());
      });
      it("should have meal Id", async () => {
        const [buyerOrder] = meal.orders;
        const { body: mealWithOrder } = await agent
          .get(`/orders/${buyerOrder._id.toString()}`)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(mealWithOrder).toHaveProperty("_id", meal._id.toString());
      });
      it("should return 404 when order not found", async () => {
        const { body } = await agent
          .get(`/orders/${mongoose.Types.ObjectId().toString()}`)
          .expect(404)
          .expect("Content-Type", /json/);
        expect(body).toHaveProperty("errMsg");
        expect(body.errMsg).toMatch(/Order not found/);
      });
      it("should return 400 when provided order id can not be converted to object id", async () => {
        await agent.get(`/orders/1`).expect(400);
      });
    });
    describe("for buyer2", () => {
      beforeEach(async () => {
        const buyer2Data = { ...buyerData, username: "buyer2" };
        await createBuyer(buyer2Data);
        await login(agent, getCred(buyer2Data));
      });
      it("should return 403 when order is not created by logged in buyer", async () => {
        const [buyerOrder] = meal.orders;
        await agent.get(`/orders/${buyerOrder._id.toString()}`).expect(403);
      });
    });
    describe("for seller", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return 403 when logged in user is not a buyer", async () => {
        const [buyerOrder] = meal.orders;
        await agent.get(`/orders/${buyerOrder._id.toString()}`).expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403 when user is not authenticated", async () => {
        const [buyerOrder] = meal.orders;
        await api.get(`/orders/${buyerOrder._id.toString()}`).expect(403);
      });
    });
  });

  describe("PUT /orders/:id", () => {
    beforeEach(async () => {
      meal = await Meal.findOne(
        {
          "orders.customer": buyer._id.toString(),
        },
        {
          orders: {
            $elemMatch: {
              customer: buyer._id.toString(),
            },
          },
        }
      ).exec();
    });
    describe("for buyer1", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should update order by id", async () => {
        const [buyerOrder] = meal.orders;
        const updates = { quantity: 5, total: 7500 };
        const { body: mealWithOrder } = await agent
          .put(`/orders/${buyerOrder._id.toString()}`)
          .set("content-type", "application/json")
          .send(updates)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(mealWithOrder).toBeDefined();
        const orderProps = Object.keys(orderData);
        const [order] = mealWithOrder.orders;
        orderProps.forEach((prop) => expect(order).toHaveProperty(prop));
        expect(order).toHaveProperty("customer._id", buyer._id.toString());
      });
      it("should return 404 when order not found", async () => {
        const updates = { quantity: 5, total: 7500 };
        const { body } = await agent
          .put(`/orders/${mongoose.Types.ObjectId().toString()}`)
          .set("content-type", "application/json")
          .send(updates)
          .expect(404)
          .expect("Content-Type", /json/);
        expect(body).toHaveProperty("errMsg");
        expect(body.errMsg).toMatch(/Order not found/);
      });
      it("should return 400 for order id that is not valid object id", async () => {
        await agent.put(`/orders/1`).expect(400);
      });
    });
    describe("for buyer2", () => {
      beforeEach(async () => {
        const buyer2Data = { ...buyerData, username: "buyer2" };
        await createBuyer(buyer2Data);
        await login(agent, getCred(buyer2Data));
      });
      it("should return 403 when updating a order that is not created by logged in buyer", async () => {
        const [buyerOrder] = meal.orders;
        const updates = { quantity: 5, total: 7500 };
        await agent
          .put(`/orders/${buyerOrder._id.toString()}`)
          .set("content-type", "application/json")
          .send(updates)
          .expect(403);
      });
    });
    describe("for seller", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return 403 when logged in user is not a buyer", async () => {
        const [buyerOrder] = meal.orders;
        const updates = { quantity: 5, total: 7500 };
        await agent
          .put(`/orders/${buyerOrder._id.toString()}`)
          .set("content-type", "application/json")
          .send(updates)
          .expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403 when user is not authenticated", async () => {
        const [buyerOrder] = meal.orders;
        const updates = { quantity: 5, total: 7500 };
        await api
          .put(`/orders/${buyerOrder._id.toString()}`)
          .set("content-type", "application/json")
          .send(updates)
          .expect(403);
      });
    });
  });
  describe("DELETE /orders/:id", () => {
    beforeEach(async () => {
      meal = await Meal.findOne(
        {
          "orders.customer": buyer._id.toString(),
        },
        {
          orders: {
            $elemMatch: {
              customer: buyer._id.toString(),
            },
          },
        }
      ).exec();
    });
    describe("for buyer1", () => {
      beforeEach(async () => {
        await login(agent, getCred(buyerData));
      });
      it("should cancel order by id", async () => {
        const [buyerOrder] = meal.orders;
        const { body } = await agent
          .delete(`/orders/${buyerOrder._id.toString()}`)
          .expect(200)
          .expect("Content-Type", /json/);
        const [order] = body.orders;
        expect(order).toHaveProperty("_id", buyerOrder._id.toString());
        expect(order).toHaveProperty("customer._id", buyer._id.toString());
        expect(order).toHaveProperty("cancelAt");
      });
      it("should return 404 when order not found", async () => {
        const { body } = await agent
          .delete(`/orders/${mongoose.Types.ObjectId().toString()}`)
          .expect(404)
          .expect("Content-Type", /json/);
        expect(body).toHaveProperty("errMsg");
        expect(body.errMsg).toMatch(/Order not found/);
      });
      it("should return 400 for order id that can not be converted to valid object id", async () => {
        await agent.delete(`/orders/1`).expect(400);
      });
    });
    describe("for buyer2", () => {
      beforeEach(async () => {
        const buyer2Data = { ...buyerData, username: "buyer2" };
        await createBuyer(buyer2Data);
        await login(agent, getCred(buyer2Data));
      });
      it("should return 403 when updating an order that is not created by logged in buyer", async () => {
        const [buyerOrder] = meal.orders;
        await agent.delete(`/orders/${buyerOrder._id.toString()}`).expect(403);
      });
    });
    describe("for seller", () => {
      beforeEach(async () => {
        await login(agent, getCred(sellerData));
      });
      it("should return 403 when logged in user is not a buyer", async () => {
        const [buyerOrder] = meal.orders;
        await agent.delete(`/orders/${buyerOrder._id.toString()}`).expect(403);
      });
    });
    describe("for unauthenticated user", () => {
      it("should return 403 when user is not authenticated", async () => {
        const [buyerOrder] = meal.orders;
        await api.delete(`/orders/${buyerOrder._id.toString()}`).expect(403);
      });
    });
  });
});
