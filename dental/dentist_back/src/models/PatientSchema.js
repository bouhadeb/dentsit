const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  status: { type: String, required: true },
  firstName: String,
  familyName: String,
  birthDate: Date,
  address: String,
  phone: String,
  description: String,
  images: [String],
  category: {
    type: String,
    enum: ["o.c", "protese", "odf", "para", "pathq"],
    required: true,
  },
  paymentSplit: [
    {
      totalCost: Number,
      remaining: Number,
      entry: {
        type: [{ paymentDate: Date, amount: Number }],
        default: [],
      },
    },
  ],
  appointment: [
    {
      date: Date,
      hour: String,
      description: String,
      status: {
        type: String,
        enum: ["En Attente", "Fait", "Annulé"],
        default: "En Attente",
      },
    },
  ],
  history: [{ description: String }],
  waitingRoom: [
    {
      visitDate: { type: Date, default: Date.now },
      checkInTime: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
      cancelled: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Patient", patientSchema);