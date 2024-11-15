const mongoose = require('mongoose');

// Car schema
const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],  // Array of tags for searching
  images: [
    {
      data: Buffer,       // Raw image data
      contentType: String // MIME type, e.g., 'image/jpeg'
    }
  ], // Array of image URLs (could be file paths or URLs)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User model
  createdAt: { type: Date, default: Date.now }
});

// Search helper function to find cars by title, description, or tags
carSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
