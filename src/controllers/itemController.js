const itemService = require('../services/itemService');

const getItems = async (_req, res, next) => {
  try {
    const items = await itemService.fetchItems();
    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'name and description are required' });
    }

    const newItem = await itemService.addItem({ name, description });
    return res.status(201).json(newItem);
  } catch (error) {
    return next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'name and description are required' });
    }

    const updatedItem = await itemService.editItem(Number(id), { name, description });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'valid item id is required' });
    }

    const deleted = await itemService.removeItem(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: `Item ${id} deleted successfully` });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem
};
