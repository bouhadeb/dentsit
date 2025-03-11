const { Router } = require("express");

const {
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
  getAllTimeRevenue, // Add this import
  getTotalPatients, // Add this import
  getLast12MonthsRevenue,
} = require("../controllers/patientController");

const router = Router();

// Prioritize new dashboard routes at the top
router.get("/last-12-months-revenue", getLast12MonthsRevenue); // New route for last 12 months revenue
router.get("/all-time-revenue", getAllTimeRevenue); // New route for all-time earnings
router.get("/total-patients", getTotalPatients); // New route for total patients
router.get("/monthly-revenue", getMonthlyRevenue); // Existing route

router.post("/", addPatient);
router.get("/", getAllPatients);
router.put("/:id", editPatient);
router.get("/:id", getPatientById);
router.delete("/:id", deletePatient);

router.post("/:id/history", addHistory);
router.get("/:id/history", getPatientHistory);
router.delete("/:patientId/history/:historyId", deleteHistory);

router.post("/split-payment/:id", addSplitPayments);
router.get("/split-payment/:id", getPatientSplitPayments);
router.post("/split-payment-entry/:id", addSplitPaymentEntry);
router.delete("/split-payment/:id", deleteSplitPayments);
router.delete("/split-payment-entry/:id", deleteSplitPaymentEntry);

router.post("/appointments/:id", addAppointment);
router.get("/appointment/:id", getAppointments);
router.put("/appointment/:id/status", updateAppointmentStatus);
router.post("/delete-appointment", deleteAppointment);

module.exports = router;