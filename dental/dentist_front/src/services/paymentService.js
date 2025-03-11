import api from "./api";

export const fetchPatientPayment = async (id) => {
  try {
    const response = await api.get(`/patient/split-payment/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

export const addPayment = async ({ id, amount }) => {
  console.log({
    id,
    amount,
  });
  try {
    const response = await api.post(`/patient/split-payment/${id}`, {
      amount,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

export const addPaymentEntry = async ({
  id,
  splitPaymentId,
  amount,
  paymentDate,
}) => {
  try {
    const response = await api.post(`/patient/split-payment-entry/${id}`, {
      splitPaymentId,
      amount,
      paymentDate,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

export const fetchPayments = async ({ name, firstDate, secondDate }) => {
  try {
    const params = {};
    if (name) params.name = name;
    if (firstDate) params.firstDate = firstDate;
    if (secondDate) params.secondDate = secondDate;
    console.log(params);
    const response = await api.get("/payments/search", { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
