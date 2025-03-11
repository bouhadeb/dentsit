const express = require('express');
const router = express.Router();
const {
  addAppointment,
  getAppointments,
  getAppointmentsThisMonth,
  changeAppointmentStatus,
  deleteAppointment,
  getAppointmentsByStatus,
} = require('../controllers/appointmentController');

router.post('/', addAppointment);
router.get('/', getAppointments);
router.get('/this-month', getAppointmentsThisMonth); // Confirm this line
router.put('/:id/status', changeAppointmentStatus);
router.delete('/:id', deleteAppointment);
router.get("/status-breakdown", getAppointmentsByStatus);

module.exports = router;