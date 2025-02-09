import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const DicomDropZone = () => {
  const [dicomData, setDicomData] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file drop event
  const handleDrop = async (event) => {
    event.preventDefault();
    setUploading(true);
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    const file = files[0];

    // Prepare form data
    const formData = new FormData();
    formData.append('dicomFile', file);

    try {
      // Send POST request to backend REST endpoint
      const response = await axios.post('http://localhost:5005/api/upload-dicom', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('DICOM Data Response:', response.data); // Debugging: Log the response
      setDicomData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  // Allow file drag-over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Download the displayed DICOM data as JSON
  const handleDownload = () => {
    if (dicomData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dicomData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "dicomData.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper 
        sx={{ 
          p: 2, 
          border: '2px dashed #ccc', 
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Typography variant="h6">
          Drag and drop a DICOM file here
        </Typography>
        {uploading && <Typography variant="body1">Uploading...</Typography>}
      </Paper>

      {dicomData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">DICOM Data:</Typography>
          <Typography>
            Patient Name: {dicomData.metadata?.PatientName || 'Not Available'}
          </Typography>
          <Typography>
            Patient's Birth Date: {dicomData.metadata?.PatientBirthDate || 'Not Available'}
          </Typography>
          <Typography>
            Series Description: {dicomData.metadata?.SeriesDescription || 'Not Available'}
          </Typography>
          {dicomData.image && (
            <Box sx={{ mt: 2 }}>
              <img 
                src={`data:image/png;base64,${dicomData.image}`} 
                alt="DICOM" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          )}
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleDownload}>
            Download DICOM Data
          </Button>
     
          {/* Debugging: Show the raw dicomData */}
          {/*
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Raw DICOM Data (Debug):</Typography>
            <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
              {JSON.stringify(dicomData, null, 2)}
            </pre>
          </Box>
          */}
        </Box>
      )}
    </Box>
  );
};

export default DicomDropZone;
