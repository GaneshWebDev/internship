const {SignUP,SignIn,verifyToken,addCar,deleteCar,updateCar,getAllCars,searchCars}=require('../controllers/userController');
const express=require('express');
const multer=require('multer');
const path=require('path');
// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads'); // Ensure this path is correct
      console.log('Saving files to:', uploadDir);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + path.extname(file.originalname);
      console.log('Saving file as:', filename);
      cb(null, filename);
    }
  });
  
  // Set up Multer with file size and type restrictions
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB file size limit
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
      }
    }
  });
const router=express.Router();
router.post('/user/signUp',SignUP);
router.post('/user/signIn',SignIn);
router.post('/user/add/car',verifyToken,upload.array('images', 10),addCar);
router.delete('/user/delete/car/:carId',verifyToken,deleteCar);
router.put('/user/update/car/:carId',verifyToken,updateCar);
router.get('/user/getAllCars',verifyToken,getAllCars);
router.get('/user/search',verifyToken,searchCars);
module.exports=router;