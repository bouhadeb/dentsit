const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  firstName: String,
  familyName: String,
  phoneNumber: String,
  date: Date,
  hour: String,
  description: String,
  status: {
    type: String,
    enum: ["En Attente", "Fait", "Annulé"],
    default: "En Attente",
  },
  // patientId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Patient",
  // },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
