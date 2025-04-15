const Medication = require("../models/MedicationSchema");

// Add new medication
const addMed = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "'name' cannot be null" });

    const newMedication = new Medication({ name });
    const savedMed = await newMedication.save();
    return res.status(201).json(savedMed);
  } catch (error) {
    next(error);
  }
};

// Get all medications
const getMeds = async (req, res, next) => {
  try {
    const medications = await Medication.find();
    return res.status(200).json(medications);
  } catch (error) {
    next(error);
  }
};

// Delete medication
const deleteMed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByIdAndDelete(id);
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    return res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMed,
  getMeds,
  deleteMed,
};
