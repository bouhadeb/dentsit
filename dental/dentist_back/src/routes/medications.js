const { Router } = require("express");

const { addMed, getMeds, deleteMed } = require("../controllers/medicationController");

const router = Router();

router.post("/", addMed);
router.get("/", getMeds);
router.delete("/:id", deleteMed);

module.exports = router;
