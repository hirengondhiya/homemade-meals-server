const createMenuItem = (req, res) => {
  const { body } = req;
  res.send({ operation: "createMenuItem", ...body });
};

const getAllMenuItems = (req, res) => {
  res.send("getAllMenuItems");
};

const getMenuItem = (req, res) => {
  const { id } = req.params;
  res.send({ operation: "getMenuItem", id });
};

const getMenuOfTheDay = (req, res) => {
  res.send("getMenuOfTheDay");
};

const updateMenuItem = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  res.send({ operation: "updateMenuItem", id, ...body });
};

const deleteMenuItem = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  res.send({ operation: "deleteMenuItem", id, ...body });
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  getMenuOfTheDay,
  updateMenuItem,
  deleteMenuItem,
};
