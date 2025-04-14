const multer = require("multer");
const path = require("path");
const Patient = require("../models/PatientSchema");
const Appointment = require("../models/AppointmentSchema");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Add a new patient with multiple image uploads
const addPatient = async (req, res, next) => {
  upload.array("images", 5)(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message });

      const { status, firstName, familyName, birthDate, address, phone, description, category } = req.body;

      // Validate required fields
      if (!status || !firstName || !familyName || !birthDate || !phone || !description || !category) {
        return res.status(400).json({
          error: "One or more of these fields is missing {status, firstName, familyName, birthDate, phone, description, category}",
        });
      }

      // Collect all image paths
      const imagePaths = req.files.map((file) => {
        return path.join("uploads", file.filename).replace(/\\/g, "/");
      });

      const newPatient = new Patient({
        status,
        firstName,
        familyName,
        birthDate,
        address,
        phone,
        description,
        images: imagePaths,
        category, // Add the category to the new patient
      });

      const savedPatient = await newPatient.save();
      res.status(201).json(savedPatient);
    } catch (error) {
      return next(error);
    }
  });
};

// Update a patient's details with image upload
const editPatient = async (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "'id' cannot be null" });
      const { status, firstName, familyName, birthDate, address, phone, description } = req.body;

      const updatedData = {
        status,
        firstName,
        familyName,
        birthDate,
        address,
        phone,
        description,
      };

      if (req.file) {
        // Find the existing patient to get the current images
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        // Add the new image to the existing images array
        const imagePath = req.file.path.replace(/\\/g, "/");
        updatedData.images = [...(patient.images || []), imagePath]; // Append new image
      }

      const updatedPatient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      return res.status(200).json(updatedPatient);
    } catch (error) {
      return next(error);
    }
  });
};

// Get All Patients
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    return res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
};

// Get Patient By Id
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) res.status(404).json({ error: "Patient not found" });

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
};

// Delete Patient
const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient)
      return res.status(404).json({ error: "Patient not found" });

    return res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// Get Patient History
const getPatientHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const patient = await Patient.findById(id);
    if (!patient) res.status(404).json({ error: "Patient not found" });

    return res.status(200).json(patient.history);
  } catch (error) {
    return next(error);
  }
};

// Patient Add History
const addHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const { description } = req.body;
    if (!description)
      return res.status(400).json({ error: "'description' cannot be null" });

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    patient.history.push({ description });
    await patient.save();

    return res.status(201).json({ description });
  } catch (error) {
    return next(error);
  }
};

// Patient Delete History
const deleteHistory = async (req, res, next) => {
  try {
    const { patientId, historyId } = req.params;
    if (!patientId)
      return res.status(400).json({ error: "'patientId' cannot be null" });
    if (!historyId)
      return res.status(400).json({ error: "'historyId' cannot be null" });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    patient.history = patient.history.filter(
      (entry) => entry._id.toString() !== historyId
    );
    await patient.save();

    return res
      .status(200)
      .json({ message: "History entry deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// Get Patient Split Payment
const getPatientSplitPayments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const patient = await Patient.findById(id);
    if (!patient) res.status(404).json({ error: "Patient not found" });

    return res.status(200).json(patient.paymentSplit);
  } catch (error) {
    return next(error);
  }
};

// Patient Add Split Payment
const addSplitPayments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const { amount } = req.body;
    if (!amount)
      return res.status(400).json({ error: "'amount' cannot be null" });

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const newSplitPayment = { totalCost: amount, remaining: amount };
    patient.paymentSplit.push(newSplitPayment);
    await patient.save();

    return res
      .status(201)
      .json({ message: "Payment split added successfully" });
  } catch (error) {
    return next(error);
  }
};

// Patient Add Split Payment Entry
const addSplitPaymentEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const { splitPaymentId, amount, paymentDate } = req.body;
    if (!splitPaymentId || !amount || !paymentDate)
      return res.status(400).json({
        error:
          "One or more of these fields is missing { splitPaymentId, amount, paymentDate }",
      });

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const splitPayment = patient.paymentSplit.id(splitPaymentId);
    if (!splitPayment)
      return res.status(404).json({ error: "Split payment not found" });

    if (amount < 1 || amount > splitPayment.remaining)
      return res.status(400).json({ error: "Invalid amount" });

    const newRemaining = splitPayment.remaining - amount;
    splitPayment.remaining = newRemaining;

    splitPayment.entry.push({ amount, paymentDate });
    await patient.save();

    return res
      .status(201)
      .json({ message: "Payment split entry added successfully" });
  } catch (error) {
    return next(error);
  }
};

// Delete Split Payment
const deleteSplitPayments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const { splitPaymentId } = req.body;
    if (!splitPaymentId)
      return res.status(400).json({ error: "'splitPaymentId' cannot be null" });

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const splitPaymentIndex = patient.paymentSplit.findIndex(
      (splitPayment) => splitPayment._id.toString() === splitPaymentId
    );

    if (splitPaymentIndex === -1)
      return res.status(404).json({ error: "Split payment not found" });

    patient.paymentSplit.splice(splitPaymentIndex, 1);

    await patient.save();

    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// Patient Delete Split Payment Entry
const deleteSplitPaymentEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const { splitPaymentId, entryId } = req.body;
    if (!splitPaymentId || !entryId)
      return res
        .status(400)
        .json({ error: "'splitPaymentId or entryId' cannot be null" });

    // Find the patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Find the specific split payment by its ID
    const splitPayment = patient.paymentSplit.id(splitPaymentId);
    if (!splitPayment) {
      return res.status(404).json({ error: "Split payment not found" });
    }

    // Find the index of the payment entry to be deleted
    const entryIndex = splitPayment.entry.findIndex(
      (entry) => entry._id.toString() === entryId
    );
    if (entryIndex === -1) {
      return res.status(404).json({ error: "Payment entry not found" });
    }

    const deletedEntryAmount = splitPayment.entry[entryIndex].amount;

    splitPayment.entry.splice(entryIndex, 1);

    splitPayment.remaining += deletedEntryAmount;

    await patient.save();

    return res
      .status(200)
      .json({ message: "Payment entry deleted successfully", patient });
  } catch (error) {
    return next(error);
  }
};

// Add Appointment for a Patient
const addAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const { date, hour, description, status } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const newAppointment = { date, hour, description, status };
    patient.appointment.push(newAppointment);
    await patient.save();

    res.status(201).json({ message: "Appointment added successfully", patient });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Appointments for a Patient
const getAppointments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "'id' cannot be null" });

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.status(200).json(patient.appointment); // Return the patient's appointments
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Change Appointment Status for a Patient
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Appointment ID from the URL
    const { status } = req.body; // New status from the request body

    if (!status) return res.status(400).json({ error: "'status' cannot be null" });

    // Find the patient who has this appointment
    const patient = await Patient.findOne({ 'appointment._id': id });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Find the appointment index
    const appointmentIndex = patient.appointment.findIndex(
      (appointment) => appointment._id.toString() === id
    );

    if (appointmentIndex === -1)
      return res.status(404).json({ error: "Appointment not found" });

    // Update the appointment status
    patient.appointment[appointmentIndex].status = status;

    await patient.save();

    return res.status(200).json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return next(error);
  }
};

// Delete Appointment for a Patient
const deleteAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.body; // Appointment ID
    if (!appointmentId) return res.status(400).json({ error: "'appointmentId' cannot be null" });

    // Find the patient who has this appointment
    const patient = await Patient.findOne({ 'appointment._id': appointmentId });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Find the index of the appointment to delete
    const appointmentIndex = patient.appointment.findIndex(
      (appointment) => appointment._id.toString() === appointmentId
    );

    if (appointmentIndex === -1)
      return res.status(404).json({ error: "Appointment not found" });

    // Remove the appointment
    patient.appointment.splice(appointmentIndex, 1);

    await patient.save();

    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return next(error);
  }
};

// Get Monthly Revenue (New Endpoint for Dashboard)
const getMonthlyRevenue = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const totalRevenue = await Patient.aggregate([
      { $unwind: "$paymentSplit" },
      { $unwind: "$paymentSplit.entry" },
      { $match: { "paymentSplit.entry.paymentDate": { $gte: firstDate, $lte: lastDate } } },
      { $group: { _id: null, total: { $sum: "$paymentSplit.entry.amount" } } },
    ]).then(result => result[0]?.total || 0);

    return res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    return next(error);
  }
};

// Get All-Time Revenue (New Endpoint for Dashboard)
const getAllTimeRevenue = async (req, res, next) => {
  try {
    const totalRevenue = await Patient.aggregate([
      { $unwind: "$paymentSplit" },
      { $unwind: "$paymentSplit.entry" },
      { $group: { _id: null, total: { $sum: "$paymentSplit.entry.amount" } } },
    ]).then(result => result[0]?.total || 0);

    return res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching all-time revenue:", error);
    return next(error);
  }
};

// Get Total Patients (New Endpoint for Dashboard)
const getTotalPatients = async (req, res, next) => {
  try {
    const totalPatients = await Patient.countDocuments();
    return res.status(200).json({ totalPatients });
  } catch (error) {
    console.error("Error fetching total patients:", error);
    return next(error);
  }
};

// Get Revenue for the Last 12 Months (New Endpoint for Dashboard)
const getLast12MonthsRevenue = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(currentDate);
      month.setMonth(month.getMonth() - i);
      return month;
    }).reverse(); // Reverse to get oldest to newest

    const revenueByMonth = await Patient.aggregate([
      { $unwind: "$paymentSplit" },
      { $unwind: "$paymentSplit.entry" },
      { $match: { 
        "paymentSplit.entry.paymentDate": { 
          $gte: new Date(months[0].getFullYear(), months[0].getMonth(), 1), 
          $lte: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        }
      } },
      { $group: { 
        _id: { 
          year: { $year: "$paymentSplit.entry.paymentDate" }, 
          month: { $month: "$paymentSplit.entry.paymentDate" }
        }, 
        total: { $sum: "$paymentSplit.entry.amount" } 
      } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $project: { 
        monthYear: { 
          $concat: [
            { $substr: [{ $toString: "$_id.month" }, 0, -1] }, 
            "/", 
            { $substr: [{ $toString: "$_id.year" }, 0, -1] }
          ]
        }, 
        total: 1, 
        _id: 0 
      } }
    ]);

    const monthlyRevenue = {};
    months.forEach(month => {
      const monthYear = `${month.getMonth() + 1}/${month.getFullYear()}`; // e.g., "2/2025" for February 2025
      monthlyRevenue[monthYear] = 0;
    });
    revenueByMonth.forEach(item => {
      monthlyRevenue[item.monthYear] = item.total || 0;
    });

    const labels = months.map(month => `${month.getMonth() + 1}/${month.getFullYear()}`);
    const data = labels.map(label => monthlyRevenue[label] || 0);

    return res.status(200).json({ labels, data });
  } catch (error) {
    console.error("Error fetching last 12 months revenue:", error);
    return next(error);
  }
};

// Add a waiting room entry with check-in time and wait time
const addWaitingRoomEntry = async (req, res, next) => {
  try {
    const { patientId, description, checkInTime, waitTime } = req.body;

    if (!patientId || !description) {
      return res.status(400).json({ error: "patientId and description are required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    patient.waitingRoom.push({
      visitDate: new Date(),
      checkInTime: checkInTime || new Date(),
      waitTime: waitTime || 0,
      description,
      completed: false,
    });

    const updatedPatient = await patient.save();
    res.status(200).json(updatedPatient);
  } catch (error) {
    return next(error);
  }
};

// Fetch all patients with waiting room entries
const fetchWaitingRoomPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({ "waitingRoom.0": { $exists: true } })
      .lean()
      .sort({ "waitingRoom.checkInTime": -1 }); // Sort by latest check-in
    res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
};

const updateWaitingRoomEntry = async (req, res, next) => {
  try {
    const { patientId, entryId, completed, cancelled, appointmentId } = req.body;

    if (!patientId || !entryId) {
      return res.status(400).json({ error: "patientId and entryId are required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const entry = patient.waitingRoom.id(entryId);
    if (!entry) {
      return res.status(404).json({ error: "Waiting room entry not found" });
    }

    // Update waiting room entry status
    if (completed !== undefined) {
      entry.completed = completed;
      if (completed) entry.cancelled = false;
    }
    if (cancelled !== undefined) {
      entry.cancelled = cancelled;
      if (cancelled) entry.completed = false;
    }

    // Update the corresponding appointment status if appointmentId is provided
    if (appointmentId) {
      const appointment = patient.appointment.id(appointmentId);
      if (appointment) {
        if (completed) {
          appointment.status = "Fait";
        } else if (cancelled) {
          appointment.status = "Annulé";
        } else {
          appointment.status = "En Attente";
        }
      } else {
        console.warn("Appointment not found for ID:", appointmentId);
      }
    }

    // Update the patient's top-level status based on the latest appointment or waiting room entry
    if (completed) {
      patient.status = "Fait";
    } else if (cancelled) {
      patient.status = "Annulé";
    } else {
      patient.status = "En Attente";
    }

    const updatedPatient = await patient.save();
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error("Error in updateWaitingRoomEntry:", error.message, error.stack);
    return next(error);
  }
};

// Get Age Distribution
const getAgeDistribution = async (req, res, next) => {
  try {
    const patients = await Patient.find({}, 'birthDate');
    
    // Calculate age groups
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61+': 0
    };

    const currentDate = new Date();
    
    patients.forEach(patient => {
      const birthDate = new Date(patient.birthDate);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 30) ageGroups['19-30']++;
      else if (age <= 45) ageGroups['31-45']++;
      else if (age <= 60) ageGroups['46-60']++;
      else ageGroups['61+']++;
    });

    return res.status(200).json(ageGroups);
  } catch (error) {
    return next(error);
  }
};

// Get Gender Distribution
const getGenderDistribution = async (req, res, next) => {
  try {
    const patients = await Patient.find({}, 'status');
    
    // Calculate gender distribution
    const genderDistribution = {
      'Homme': 0,
      'Femme': 0,
      'Autre': 0
    };

    patients.forEach(patient => {
      const status = patient.status || '';
      if (status.startsWith('M.')) {
        genderDistribution['Homme']++;
      } else if (status.startsWith('Mme') || status.startsWith('Mlle')) {
        genderDistribution['Femme']++;
      } else {
        genderDistribution['Autre']++;
      }
    });

    return res.status(200).json(genderDistribution);
  } catch (error) {
    return next(error);
  }
};

// Get Category Distribution
const getCategoryDistribution = async (req, res, next) => {
  try {
    const patients = await Patient.find({}, 'category');
    
    // Calculate category distribution
    const categoryDistribution = {};

    patients.forEach(patient => {
      const category = patient.category || 'Non spécifié';
      if (!categoryDistribution[category]) {
        categoryDistribution[category] = 0;
      }
      categoryDistribution[category]++;
    });

    return res.status(200).json(categoryDistribution);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addPatient,
  editPatient,
  addHistory,
  deleteHistory,
  getAllPatients,
  getPatientById,
  getPatientHistory,
  deletePatient,
  getPatientSplitPayments,
  addSplitPayments,
  addSplitPaymentEntry,
  deleteSplitPayments,
  deleteSplitPaymentEntry,
  addAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getMonthlyRevenue,
  getAllTimeRevenue,
  getTotalPatients,
  getLast12MonthsRevenue,
  addWaitingRoomEntry,
  fetchWaitingRoomPatients,
  updateWaitingRoomEntry,
  getAgeDistribution,
  getGenderDistribution,
  getCategoryDistribution,
};