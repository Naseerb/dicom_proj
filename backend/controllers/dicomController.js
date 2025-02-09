
const { spawn } = require('child_process');
const path = require('path');
const Dicom = require('../models/Dicom');

exports.uploadDicom = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  
  const filePath = path.join(__dirname, '../', req.file.path);


 
  const process = spawn('python3', [
    path.join(__dirname, '../python/process_dicom.py'),
    filePath,
  ]);
  

  let pythonOutput = '';

  process.stdout.on('data', (data) => {
    pythonOutput += data.toString();
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', async (code) => {
    try {
      // To parse the JSON output from the Python script
      const dicomData = JSON.parse(pythonOutput);

      // To save the DICOM data to MongoDB.
      const newDicom = new Dicom({
        patientName: dicomData.patientName,
        patientBirthDate: dicomData.patientBirthDate,
        seriesDescription: dicomData.seriesDescription,
        image: dicomData.image, 
        metadata: dicomData.metadata,
      });

      const savedDicom = await newDicom.save();

      res.json(savedDicom);
    } catch (err) {
      console.error('Error processing DICOM file:', err);
      res.status(500).json({ error: 'Error processing DICOM file' });
    }
  });
};
