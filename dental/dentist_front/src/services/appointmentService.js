import api from './api';


// Delete an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    await api.post(`/patient/delete-appointment`, {
      appointmentId: appointmentId
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
// Update appointment status
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    await api.put(`/patient/appointment/${appointmentId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};
