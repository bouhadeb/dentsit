const { Router } = require("express");

const { addMed, getMeds } = require("../controllers/medicationController");

const router = Router();

router.post("/", addMed);
router.get("/", getMeds);

module.exports = router;
