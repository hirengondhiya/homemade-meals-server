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
const buyerCred = {
  username: buyerData.username,
  password: buyerData.password,
};
const sellerCred = {
  username: sellerData.username,
  password: sellerData.password,
};

describe("Authentication Routes", () => {
  after(async () => {
    await mongoose.connection.db.dropDatabase();
    app.close();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("users");
  });
  describe("GET /logout", () => {
    beforeEach(async () => {
      await createBuyer(buyerData);
      await createSeller(sellerData);
    });
    it("should logout buyer", async () => {
      await login(agent, buyerCred);
      await agent.get("/logout").expect(200);
    });
    it("should logout seller", async () => {
      await login(agent, sellerCred);
      await agent.get("/logout").expect(200);
    });
  });
  describe("POST /login", () => {
    beforeEach(async () => {
      await createBuyer(buyerData);
      await createSeller(sellerData);
    });
    it("should login buyer", async () => {
      const { username, password, role, email } = buyerData;
      const { body } = await api
        .post("/login")
        .send({ username, password })
        .expect("Content-Type", /json/)
        .expect(200);
      expect(body).toMatchObject({ username, email, role });
    });
    it("should login seller", async () => {
      const { username, password, role, email } = sellerData;
      const { body } = await api
        .post("/login")
        .send({ username, password })
        .expect("Content-Type", /json/)
        .expect(200);
      expect(body).toMatchObject({ username, email, role });
    });
    it("should not accept invalid password", async () => {
      const { username, password } = sellerData;
      await api
        .post("/login")
        .send({ username, password: password + "!" })
        .expect(401);
    });
  });
  describe("POST /register", () => {
    it("should accept seller registrtion", async () => {
      const { username, email, role } = sellerData;
      const { body } = await api
        .post("/register")
        .send(sellerData)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(body).toMatchObject({ username, email, role });
    });
    it("should accept buyer registration", async () => {
      const { username, email, role } = buyerData;
      const { body } = await api
        .post("/register")
        .send(buyerData)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(body).toMatchObject({ username, email, role });
    });
    it("should not accept double registration", async () => {
      await createBuyer(buyerData);
      await api
        .post("/register")
        .send(buyerData)
        .expect("Content-Type", /json/)
        .expect(409);
    });
  });
});
