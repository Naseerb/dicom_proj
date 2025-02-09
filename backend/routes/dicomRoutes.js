const express = require('express');
const multer = require('multer');
const path = require('path');
const dicomController = require('../controllers/dicomController');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


router.post('/upload-dicom', upload.single('dicomFile'), dicomController.uploadDicom);

module.exports = router;
