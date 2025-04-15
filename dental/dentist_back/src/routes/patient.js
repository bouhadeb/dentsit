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
  getAllTimeRevenue,
  getTotalPatients,
  getLast12MonthsRevenue,
  addWaitingRoomEntry,
  fetchWaitingRoomPatients,
  updateWaitingRoomEntry,
  getAgeDistribution,
  getGenderDistribution,
  getCategoryDistribution,
} = require("../controllers/patientController");

const router = Router();

// Prioritize specific routes at the top
router.get("/last-12-months-revenue", getLast12MonthsRevenue);
router.get("/all-time-revenue", getAllTimeRevenue);
router.get("/total-patients", getTotalPatients);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/age-distribution", getAgeDistribution);
router.get("/gender-distribution", getGenderDistribution);
router.get("/category-distribution", getCategoryDistribution);

router.get("/waiting-room", fetchWaitingRoomPatients); // Changed from /waitingroom
router.post("/waiting-room/add", addWaitingRoomEntry); // Changed from /waitingroom/add
router.put("/waiting-room/update", updateWaitingRoomEntry); // Changed from /waitingroom/update

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
router.get("/appointments/:id", getAppointments); // Changed from /appointment/:id
router.put("/appointment/:id/status", updateAppointmentStatus);
router.post("/delete-appointment", deleteAppointment); // Consider changing to DELETE /appointments/:id

module.exports = router;