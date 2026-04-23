const express = require('express');
const multer = require('multer');
const path = require('path');
const itemController = require('../controllers/itemController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/', itemController.getItems);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);
router.post('/:id/image', upload.single('image'), itemController.uploadImage);
router.get('/image/:blobName', itemController.streamItemImage);
router.get('/:id/images', itemController.getItemImages);
router.delete('/:id/image', itemController.deleteImage);

module.exports = router;
