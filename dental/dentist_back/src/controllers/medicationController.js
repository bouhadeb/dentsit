const Medication = require("../models/MedicationSchema");

// Add new medication
const addMed = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "'name' cannot be null" });

    const newMedication = new Medication({ name });
    const savedMed = newMedication.save();
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

module.exports = {
  addMed,
  getMeds,
};
