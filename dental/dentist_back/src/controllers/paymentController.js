const Patient = require("../models/PatientSchema");

// Function to search payments by name, date range, or both
const searchPayments = async (req, res, next) => {
  const { name, firstDate, secondDate } = req.query;

  try {
    const query = {};

    // If name is provided, search by firstName or familyName (case-insensitive)
    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { familyName: { $regex: name, $options: "i" } },
      ];
    }

    // Find matching patients and project required fields
    const patients = await Patient.find(query, {
      firstName: 1,
      familyName: 1,
      phone: 1,
      "paymentSplit.entry": 1,
    });

    // Define date range for filtering entries
    let startOfDateRange = null;
    let endOfDateRange = null;

    if (firstDate) {
      startOfDateRange = new Date(firstDate);
      if (isNaN(startOfDateRange.getTime())) {
        return res.status(400).json({ error: "Invalid firstDate" });
      }
      startOfDateRange.setUTCHours(0, 0, 0, 0);

      if (secondDate) {
        endOfDateRange = new Date(secondDate);
        if (isNaN(endOfDateRange.getTime())) {
          return res.status(400).json({ error: "Invalid secondDate" });
        }
        endOfDateRange.setUTCHours(23, 59, 59, 999);
      } else {
        endOfDateRange = new Date(firstDate);
        endOfDateRange.setUTCHours(23, 59, 59, 999);
      }
    }

    // Filter entries based on date range and map to include patient info
    const allEntries = patients.flatMap((patient) =>
      patient.paymentSplit.flatMap((split) =>
        split.entry
          .filter((entry) => {
            const paymentDate = new Date(entry.paymentDate);
            return (
              (!startOfDateRange || paymentDate >= startOfDateRange) &&
              (!endOfDateRange || paymentDate <= endOfDateRange)
            );
          })
          .map((entry) => ({
            ...entry.toObject(), // Extract payment entry fields (paymentDate, amount, _id)
            firstName: patient.firstName,
            familyName: patient.familyName,
            phone: patient.phone,
          }))
      )
    );

    // Calculate the total amount
    const totalAmount = allEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    // Return the entries and total amount
    return res.status(200).json({
      totalAmount,
      entries: allEntries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchPayments };
