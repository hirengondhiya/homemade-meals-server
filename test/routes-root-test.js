require("./helpers/config");
const request = require("supertest");
const app = require("../app");

describe("Root Routes", () => {
  after(async () => {
    app.close();
  });
  describe("GET /", function () {
    it("responds with 200", function (done) {
      request(app).get("/").expect(200, done);
    });
  });
  describe("GET /random", function () {
    it("responds with 404", function (done) {
      request(app).get("/random").expect(404, done);
    });
  });
});
