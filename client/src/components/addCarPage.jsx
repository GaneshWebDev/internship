import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AddCarForm() {
    const Navigate=useNavigate();
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    images: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [imageFields, setImageFields] = useState([null]); // For managing dynamic image input fields

  // Handle text input changes (title, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle tag input and addition
  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput],
      });
      setTagInput('');
    }
  };

  // Handle image file selection
  /*const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files);

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };*/
  const handleImageChange = async (e) => {
    const files = e.target.files;
    const newImages = Array.from(files);
  
    // Validate image size before adding it to the form data
    const validatedImages = newImages.filter((image) => {
      if (image.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File is too large. Please select an image smaller than 2MB.');
        return false; // Exclude this image
      }
      return true; // Include this image
    });
  
    if (validatedImages.length > 0) {
      // Compress each valid image before adding it to the form data
      const compressedImages = await Promise.all(validatedImages.map(async (image) => {
        const options = {
          maxSizeMB: 1, // Maximum file size in MB
          maxWidthOrHeight: 800, // Maximum width or height (resize)
          useWebWorker: true, // Enable web worker for compression
        };
  
        try {
          const compressedImage = await imageCompression(image, options);
          console.log(`Original size: ${image.size}, Compressed size: ${compressedImage.size}`);
          return compressedImage;
        } catch (error) {
          console.error('Error compressing image:', error);
          return image; // If compression fails, return original image
        }
      }));
  
      // Add compressed images to the form data
      setFormData({
        ...formData,
        images: [...formData.images, ...compressedImages],
      });
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tags', JSON.stringify(formData.tags)); // Convert tags array to JSON
    
    // Append image files
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });
    console.log(formData,'ino')
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:5000/user/add/car', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Car added successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding car:', error);
      if(error.message=='Invalid token.'){
          localStorage.removeItem('jwtToken');
          Navigate('/login')
      }
      alert('An error occurred while adding the car');
    }
  };

  // Add new image field input
  const addImageField = () => {
    setImageFields([...imageFields, null]);
  };

  // Remove an image field input
  const removeImageField = (index) => {
    const updatedFields = [...imageFields];
    updatedFields.splice(index, 1);
    setImageFields(updatedFields);
  };

  return (
    <div className="container mx-auto p-4">
      <button
            type="button"
            onClick={()=>{
                Navigate('/');
            }}
            className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
          >
            Back 
          </button>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 mt-10 max-w-lg mx-auto border rounded shadow-sm">
        {/* Title Field */}
        <legend className='text-bold'>Add Car</legend>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Car title"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Car description"
          />
        </div>

        {/* Tags Section */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tags: formData.tags.filter((t) => t !== tag),
                    });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagChange}
              className="border p-2 w-full"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add 
            </button>
          </div>
        </div>

        {/* Images Section */}
        <div>
          <label className="block text-sm font-medium">Images</label>
          {imageFields.map((_, index) => (
            <div key={index} className="mt-2 flex space-x-2">
              <input
                type="file"
                className="border p-2 w-full"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
          >
            Add Image
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Add Car
        </button>
      </form>
    </div>
  );
}

export default AddCarForm;
