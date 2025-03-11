const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");

const patientRoutes = require("./routes/patient");
const appointmentRoutes = require("./routes/appointment");
const medicationsRoutes = require("./routes/medications");
const paymentsRoutes = require("./routes/payments");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/dental-clinic", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medications", medicationsRoutes);
app.use("/api/payments", paymentsRoutes);

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
