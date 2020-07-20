const User = require("../../models/user");
// const request = require("supertest")
// const app = require("../app")

const sellerData = {
  username: "seller",
  password: "seller-pw",
  email: "seller@email.com",
  role: "seller",
};
const buyerData = {
  username: "buyer",
  password: "buyer-pw",
  email: "buyer@email.com",
  role: "buyer",
};
const createSeller = () => {
  return new Promise((resolve, reject) => {
    const { username, email, role } = sellerData;
    User.register(
      new User({ username, email, role }),
      sellerData.password,
      function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
};
const createBuyer = () => {
  return new Promise((resolve, reject) => {
    const { username, email, role } = buyerData;
    User.register(
      new User({ username, email, role }),
      buyerData.password,
      function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
};
const loginAsBuyer = (agent, done) => {
  // const agent = request.agent(app)
  const { username, password } = buyerData;
  agent
    .post("/login")
    .send({ username, password })
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err) => {
      if (err) {
        return done(err);
      }
    });
  // return agent
};
const LoginAsSeller = (agent, done) => {
  // const agent = request.agent(app)
  const { username, password } = sellerData;
  agent
    .post("/login")
    .send({ username, password })
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err) => {
      if (err) {
        return done(err);
      }
    });
};

module.exports = {
  buyerData,
  createBuyer,
  createSeller,
  sellerData,
  loginAsBuyer,
  LoginAsSeller,
};
