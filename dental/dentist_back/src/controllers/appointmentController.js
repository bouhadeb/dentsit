const Appointment = require("../models/AppointmentSchema"); // Already present
const Patient = require("../models/PatientSchema"); // Add this line

// Add a new appointment
const addAppointment = async (req, res, next) => {
  try {
    const {
      firstName,
      familyName,
      phoneNumber,
      date,
      hour,
      description,
      patientId,
    } = req.body;
    const newAppointment = new Appointment({
      firstName,
      familyName,
      phoneNumber,
      date,
      hour,
      description,
      patientId,
    });
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Appointments
const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get Appointments for the Current Month
const getAppointmentsThisMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const patients = await Patient.aggregate([
      { $unwind: "$appointment" },
      { $match: { 
        "appointment.date": { $gte: firstDate, $lte: lastDate },
        "appointment.status": { $ne: "Annulé" } // Exclude canceled appointments
      } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]).then(result => result[0]?.count || 0);

    res.json({ count: patients });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Change Appointment by ID
const changeAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment status", error });
  }
};

// Delete Appointment by ID
const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAppointmentsByStatus = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const statusBreakdown = await Patient.aggregate([
      { $unwind: "$appointment" },
      { $match: { 
        "appointment.date": { $gte: firstDate, $lte: lastDate }
      } },
      { $group: { 
        _id: "$appointment.status", 
        count: { $sum: 1 } 
      } },
      { $project: { 
        status: "$_id", 
        count: 1, 
        _id: 0 
      } }
    ]);

    const breakdown = {};
    statusBreakdown.forEach(item => breakdown[item.status] = item.count || 0);
    res.status(200).json(breakdown);
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    return next(error);
  }
};

module.exports = {
  addAppointment,
  getAppointments,
  getAppointmentsThisMonth,
  changeAppointmentStatus,
  deleteAppointment,
  getAppointmentsByStatus,
};