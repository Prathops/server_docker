const itemService = require('../services/itemService');
const blobService = require('../services/blobService');

const getBaseUrl = (req) => process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;

const toBlobProxyUrl = (req, blobName) => `${getBaseUrl(req)}/api/items/image/${encodeURIComponent(blobName)}`;

const getBlobNameFromStoredRef = (storedRef) => {
  if (!storedRef) {
    return null;
  }

  if (storedRef.startsWith('http://') || storedRef.startsWith('https://')) {
    return null;
  }

  if (storedRef.startsWith('/uploads/') || storedRef.startsWith('/api/uploads/')) {
    return null;
  }

  return storedRef;
};

const buildImageUrl = (req, imageUrl) => {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/uploads/')) {
    return `${getBaseUrl(req)}${imageUrl.replace('/uploads/', '/api/uploads/')}`;
  }

  if (imageUrl.startsWith('/api/')) {
    return `${getBaseUrl(req)}${imageUrl}`;
  }

  return toBlobProxyUrl(req, imageUrl);
};

const getItems = async (req, res, next) => {
  try {
    const items = await itemService.fetchItems();
    return res.status(200).json(
      items.map((item) => ({
        ...item,
        image_url: buildImageUrl(req, item.image_url)
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

    const blobName = await blobService.uploadBuffer(req.file.buffer, {
      originalName: req.file.originalname,
      contentType: req.file.mimetype
    });

    const updated = await itemService.updateItemImage(itemId, blobName, blobName);

    if (!updated) {
      await blobService.deleteBlob(blobName);
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({
      message: 'Image uploaded successfully',
      imageFilename: blobName,
      imageUrl: buildImageUrl(req, blobName)
    });
  } catch (error) {
    return next(error);
  }
};

const streamItemImage = async (req, res, next) => {
  try {
    const blobName = decodeURIComponent(req.params.blobName);
    const file = await blobService.downloadBlob(blobName);

    if (file.contentType) {
      res.setHeader('Content-Type', file.contentType);
    }
    res.setHeader('Cache-Control', 'private, max-age=300');

    file.stream.pipe(res);
  } catch (error) {
    if (error.message === 'blob_not_found') {
      return res.status(404).json({ message: 'Image not found' });
    }
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
      imageUrl: buildImageUrl(req, item.image_url)
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

    const currentItem = await itemService.getItemWithImages(itemId);

    if (!currentItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const updated = await itemService.removeItemImage(itemId);

    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const blobName = getBlobNameFromStoredRef(currentItem.image_url || currentItem.image_filename);
    if (blobName) {
      await blobService.deleteBlob(blobName);
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
  streamItemImage,
  getItemImages,
  deleteImage
};