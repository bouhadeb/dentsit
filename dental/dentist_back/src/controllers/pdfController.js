const pdfService = require('../services/pdfService');

const pdfController = {
  async uploadPDF(req, res) {
    try {
      const { patientId } = req.params;
      console.log('Uploading PDF for patient:', patientId);
      
      if (!req.file) {
        console.log('No file received in request');
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      await pdfService.uploadPDF(patientId, req.file.buffer);
      res.status(200).json({ 
        message: 'PDF uploaded successfully',
        filename: `patient_${patientId}.pdf`
      });
    } catch (error) {
      console.error('Error in uploadPDF:', error);
      res.status(500).json({ error: 'Failed to upload PDF', details: error.message });
    }
  },

  async getPDF(req, res) {
    try {
      const { patientId } = req.params;
      console.log('Getting PDF for patient:', patientId);
      
      const pdfBuffer = await pdfService.getPDF(patientId);

      if (!pdfBuffer) {
        console.log('PDF not found for patient:', patientId);
        return res.status(404).json({ error: 'PDF not found' });
      }

      console.log('Sending PDF response for patient:', patientId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=patient_${patientId}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error in getPDF:', error);
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'PDF not found' });
      }
      res.status(500).json({ error: 'Failed to get PDF', details: error.message });
    }
  },

  async deletePDF(req, res) {
    try {
      const { patientId } = req.params;
      console.log('Deleting PDF for patient:', patientId);
      
      await pdfService.deletePDF(patientId);
      res.status(200).json({ message: 'PDF deleted successfully' });
    } catch (error) {
      console.error('Error in deletePDF:', error);
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'PDF not found' });
      }
      res.status(500).json({ error: 'Failed to delete PDF', details: error.message });
    }
  }
};

module.exports = pdfController; 