const fs = require('fs');
const path = require('path');

const setupUploads = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  const pdfsDir = path.join(uploadsDir, 'pdfs');

  try {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    }

    // Create pdfs directory if it doesn't exist
    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir, { recursive: true });
      console.log('Created pdfs directory:', pdfsDir);
    }

    // Set permissions (read/write for owner, read for others)
    fs.chmodSync(uploadsDir, 0o755);
    fs.chmodSync(pdfsDir, 0o755);
    console.log('Set permissions for upload directories');

    console.log('Upload directories setup completed successfully');
  } catch (error) {
    console.error('Error setting up upload directories:', error);
    process.exit(1);
  }
};

setupUploads(); 