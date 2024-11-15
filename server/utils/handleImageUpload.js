const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maximum file size 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true); // Accept file
    }
    cb(new Error('Only image files are allowed'), false); // Reject file
  },
});

module.exports = upload;
