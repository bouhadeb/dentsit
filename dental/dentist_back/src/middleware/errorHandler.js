// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.message); // Use err instead of error for consistency
  res.status(500).json({ error: "Internal server error: " + err.message });
};

module.exports = errorHandler;
