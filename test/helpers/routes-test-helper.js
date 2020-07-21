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
const createSeller = (seller) => {
  return new Promise((resolve, reject) => {
    const { username, email, role } = seller;
    User.register(
      new User({ username, email, role }),
      seller.password,
      function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
};
const createBuyer = (buyer) => {
  return new Promise((resolve, reject) => {
    const { username, email, role } = buyer;
    User.register(
      new User({ username, email, role }),
      buyer.password,
      function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
};
const login = async (agent, user) => {
  agent.post("/login").send(user).expect(200);
};

module.exports = {
  buyerData,
  createBuyer,
  createSeller,
  sellerData,
  login,
};
