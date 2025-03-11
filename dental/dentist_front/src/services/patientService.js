import api from "./api";

export const createPatient = async (formData) => {
  const data = new FormData();
  for (let key in formData) {
    if (key === "images") {
      formData.images.forEach((image, index) => {
        data.append("images", image); // Send each image file
      });
    } else {
      data.append(key, formData[key]);
    }
  }

  try {
    await api.post(`/patient`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error;
  }
};


export const fetchPatient = async (id) => {
  try {
    const response = await api.get(`/patient/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const fetchAllPatients = async () => {
  try {
    const response = await api.get("/patient");
    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const updatePatient = async (id, formData) => {
  try {
    const response = await api.put(`/patient/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patient/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const fetchHistory = async (id) => {
  try {
    const response = await api.get(`/patient/${id}/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};

export const addHistory = async ({ id, description }) => {
  try {
    const response = await api.post(`/patient/${id}/history`, { description });
    return response.data;
  } catch (error) {
    console.error("Error adding history:", error);
    throw error;
  }
};

export const deleteHistory = async ({ id, historyId }) => {
  try {
    await api.delete(`/patient/${id}/history/${historyId}`);
    return;
  } catch (error) {
    console.error("Error deleting history:", error);
    throw error;
  }
};

export const addAppointment = async (id, appointmentData) => {
  try {
    const response = await api.post(`/patient/appointments/${id}`, appointmentData);  // Corrected endpoint
    return response.data; 
  } catch (error) {
    throw error;
  }
};
