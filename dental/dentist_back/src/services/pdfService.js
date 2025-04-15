const fs = require('fs');
const path = require('path');

class PDFService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads/pdfs');
    this.ensureUploadDirectory();
  }

  ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log('Created upload directory:', this.uploadDir);
    }
  }

  getPDFPath(patientId) {
    return path.join(this.uploadDir, `patient_${patientId}.pdf`);
  }

  async uploadPDF(patientId, pdfBuffer) {
    try {
      const pdfPath = this.getPDFPath(patientId);
      console.log('Uploading PDF to:', pdfPath);
      await fs.promises.writeFile(pdfPath, pdfBuffer);
      console.log('PDF uploaded successfully');
      return true;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }

  async getPDF(patientId) {
    try {
      const pdfPath = this.getPDFPath(patientId);
      console.log('Looking for PDF at:', pdfPath);
      
      if (!fs.existsSync(pdfPath)) {
        console.log('PDF not found at:', pdfPath);
        return null;
      }
      
      const pdfBuffer = await fs.promises.readFile(pdfPath);
      console.log('PDF found and read successfully');
      return pdfBuffer;
    } catch (error) {
      console.error('Error getting PDF:', error);
      throw error;
    }
  }

  async deletePDF(patientId) {
    try {
      const pdfPath = this.getPDFPath(patientId);
      console.log('Attempting to delete PDF at:', pdfPath);
      
      if (fs.existsSync(pdfPath)) {
        await fs.promises.unlink(pdfPath);
        console.log('PDF deleted successfully');
      } else {
        console.log('PDF not found for deletion');
      }
      return true;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  }
}

module.exports = new PDFService(); 