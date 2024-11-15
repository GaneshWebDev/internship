const User = require('../models/userModel'); 
const Car =require('../models/carModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;
const mongoose=require('mongoose');
const fs=require('fs');
 async function SignUP(req, res){
  const { name, email, password } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const newUser = new User({
      name,
      email,
      password
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration', error });
  }
};
async function SignIn(req, res) {
    const { email, password } = req.body;
    try {
      // Check if a user with the provided email exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: 'User does not exist' });
      }
  
      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email },
        process.env.JWT_SCERET_KEY, // Replace 'yourSecretKey' with an environment variable for security
        { expiresIn: '1h' }
      );
  
      // Send response with token
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ message: 'Server error during login', error });
    }
  };


const verifyToken = (req, res, next) => {
  // Get the token from the header
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and attach the decoded user information to `req.user`
    const decoded = jwt.verify(token, process.env.JWT_SCERET_KEY); // Ensure JWT_SECRET is set in your environment variables
    req.user = decoded;
    next(); // Call the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
// Controller function to add a new car
async function addCar(req, res){
  try {
    // Create a new Car document
    const newCar = new Car({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags.split(','),  // Assuming tags are sent as a comma-separated string
      user: req.user.id,  // Assuming `req.user` is available after user authentication
    });

    // Process each uploaded image and add them to the Car document
    req.files.forEach((file) => {
      newCar.images.push({
        data: fs.readFileSync(file.path),  // Read the image as binary data
        contentType: file.mimetype,  // Store the MIME type of the image
      });
    });
    // Save the Car document to the database
    await newCar.save();

     // Clean up temporary files after saving to DB
     req.files.forEach((file) => {
      try {
        fs.unlinkSync(file.path);  // Remove the temporary file
        console.log(`Deleted file: ${file.path}`);  // Log for debugging
      } catch (error) {
        console.error(`Failed to delete file ${file.path}:`, error);
      }
    });

    res.json({ message: 'Car added successfully!', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Error adding car.', error });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = req.params.carId; // The car ID should be passed as a route parameter
    
    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }

    // Find the car by ID and delete it
    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'An error occurred while deleting the car', error: error.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const carId = req.params.carId; // Get the car ID from the URL parameter
    const { title, description, tags, images } = req.body; // Get updated fields from the request body

    // Ensure carId is provided
    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }

    // Find the car by its ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the logged-in user is the owner of the car
    if (car.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this car' });
    }

    // Update car fields with the provided data (if available)
    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = tags || car.tags;
    car.images = images || car.images;

    // Save the updated car
    await car.save();

    // Respond with a success message and the updated car details
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'An error occurred while updating the car', error: error.message });
  }
};

const getAllCars = async (req, res) => {
  try {
    // Fetch all cars from the database
    const userId = req.user.id;
    console.log(userId)
    const cars = await Car.find({ user: { $ne: userId } }).populate('user', 'email');

    // If no cars are found
    if (cars.length === 0) {
      return res.status(404).json({ message: 'No cars found' });
    }
    // Respond with the list of cars
    res.status(200).json({ message: 'Cars fetched successfully', cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'An error occurred while fetching cars', error: error.message });
  }
};

const searchCars = async (req, res) => {
  const searchKeyword = req.query.keyword; // Keyword sent in query parameter (e.g. ?keyword=car)
  const searchId = req.query.id; // If searching by ID, use the 'id' query parameter
 console.log(searchId);
  if (!searchKeyword && !searchId) {
    return res.status(400).json({ message: 'Please provide a search keyword or car ID.' });
  }

  try {
    if (searchId) {
      // Check if the provided ID is a valid ObjectId
      const carId = new ObjectId(searchId);
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ message: 'Invalid car ID format.' });
      }
      
      // Search by car ID
      const car = await Car.findById(searchId).populate('user', 'email');
      if (!car) {
        return res.status(404).json({ message: 'Car not found by ID.' });
      }
      // Return the specific car
      return res.status(200).json({ car });
    }

    if (searchKeyword) {
      // Search using the keyword (text search)
      const cars = await Car.find({
        $text: { $search: searchKeyword }
      }).populate('user', 'email'); // Optional: populate user information

      // If no cars found by keyword
      if (cars.length === 0) {
        return res.status(404).json({ message: 'No cars found matching your search.' });
      }

      // Return all matching cars
      return res.status(200).json({ cars });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {SignUP,SignIn,verifyToken,addCar,deleteCar,updateCar,getAllCars,searchCars};
