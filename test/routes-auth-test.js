require("./helpers/config");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const agent = request.agent(app);
const expect = require("expect");
const {
  createSeller,
  createBuyer,
  buyerData,
  sellerData,
  loginAsBuyer,
  LoginAsSeller,
} = require("./helpers/routes-test-helper");

describe("Authentication Routes", () => {
  after(async () => {
    await mongoose.connection.db.dropDatabase();
    app.close();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("users");
  });
  describe("GET /logout", function () {
    beforeEach(async () => {
      await createBuyer();
      await createSeller();
    });
    it("should logout buyer", function (done) {
      loginAsBuyer(agent, done);
      agent.get("/logout").expect(200, done);
    });
    it("should logout seller", function (done) {
      LoginAsSeller(agent, done);
      agent.get("/logout").expect(200, done);
    });
  });
  describe("POST /login", function () {
    beforeEach(async () => {
      await createBuyer();
      await createSeller();
    });
    it("should login buyer", function (done) {
      const { username, password } = buyerData;
      request(app)
        .post("/login")
        .send({ username, password })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.role).toMatch(buyerData.role);
          return done();
        })
        .catch((err) => done(err));
    });
    it("should login seller", function (done) {
      const { username, password } = sellerData;
      request(app)
        .post("/login")
        .send({ username, password })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.role).toMatch(sellerData.role);
          return done();
        })
        .catch((err) => done(err));
    });
    it("should not accept invalid password", function (done) {
      const { username, password } = sellerData;
      request(app)
        .post("/login")
        .send({ username, password: password + "!" })
        .expect(401, done);
    });
  });
  describe("POST /register", function () {
    it("should accept seller registrtion", function (done) {
      request(app)
        .post("/register")
        .send(sellerData)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.role).toMatch(sellerData.role);
          return done();
        })
        .catch((err) => done(err));
    });
    it("should accept buyer registrtion", function (done) {
      request(app)
        .post("/register")
        .send(buyerData)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.role).toMatch(buyerData.role);
          return done();
        })
        .catch((err) => done(err));
    });
    it("should not accept double registration", function (done) {
      createBuyer()
        .then(() => {
          request(app)
            .post("/register")
            .send(buyerData)
            .expect("Content-Type", /json/)
            .expect(400, done);
        })
        .catch((err) => done(err));
    });
  });
});
