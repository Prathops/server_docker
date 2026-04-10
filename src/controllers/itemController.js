const itemService = require('../services/itemService');

const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return imageUrl;
  }

  return imageUrl.startsWith('/uploads/')
    ? imageUrl.replace('/uploads/', '/api/uploads/')
    : imageUrl;
};

const getItems = async (_req, res, next) => {
  try {
    const items = await itemService.fetchItems();
    return res.status(200).json(
      items.map((item) => ({
        ...item,
        image_url: normalizeImageUrl(item.image_url)
      }))
    );
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

const uploadImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const itemId = Number(id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ message: 'Valid item ID is required' });
    }

    const filename = req.file.filename;
    const imageUrl = `/api/uploads/${filename}`;

    // Update item with image in service
    const updated = await itemService.updateItemImage(itemId, filename, imageUrl);

    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({
      message: 'Image uploaded successfully',
      imageFilename: filename,
      imageUrl
    });
  } catch (error) {
    return next(error);
  }
};

const getItemImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ message: 'Valid item ID is required' });
    }

    const item = await itemService.getItemWithImages(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({
      id: item.id,
      name: item.name,
      imageFilename: item.image_filename,
      imageUrl: normalizeImageUrl(item.image_url)
    });
  } catch (error) {
    return next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ message: 'Valid item ID is required' });
    }

    const updated = await itemService.removeItemImage(itemId);

    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({
      message: 'Image removed successfully'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  uploadImage,
  getItemImages,
  deleteImage
};
