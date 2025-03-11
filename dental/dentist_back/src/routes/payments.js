const { Router } = require("express");

const { searchPayments } = require("../controllers/paymentController");

const router = Router();

router.get("/search", searchPayments);

module.exports = router;
