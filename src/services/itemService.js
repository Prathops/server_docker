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

const updateItemImage = async (id, filename, imageUrl) => {
  return itemModel.updateItemImageById(id, filename, imageUrl);
};

const getItemWithImages = async (id) => {
  return itemModel.getItemById(id);
};

const removeItemImage = async (id) => {
  return itemModel.deleteItemImageById(id);
};

module.exports = {
  fetchItems,
  addItem,
  editItem,
  removeItem,
  updateItemImage,
  getItemWithImages,
  removeItemImage
};
