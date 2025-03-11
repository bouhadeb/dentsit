const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  status: { type: String, required: true }, // New field for status
  firstName: String,
  familyName: String,
  birthDate: Date,
  address: String,
  phone: String,
  description: String,
  images: [String],
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
});

module.exports = mongoose.model("Patient", patientSchema);
