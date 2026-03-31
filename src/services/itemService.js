const itemModel = require('../models/itemModel');

const fetchItems = async () => {
  return itemModel.getAllItems();
};

const addItem = async (payload) => {
  return itemModel.createItem(payload);
};

const editItem = async (id, payload) => {
  return itemModel.updateItemById(id, payload);
};

const removeItem = async (id) => {
  return itemModel.deleteItemById(id);
};

module.exports = {
  fetchItems,
  addItem,
  editItem,
  removeItem
};
