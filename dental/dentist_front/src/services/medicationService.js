import api from "./api";

export const createMed = async (name) => {
  try {
    const response = await api.post("/medications", name);
    return response;
  } catch (error) {
    console.error("Error creating medication:", error);
    throw error;
  }
};

export const fetchMeds = async () => {
  try {
    const response = await api.get("/medications");
    return response.data;
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw error;
  }
};
