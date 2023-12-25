const express = require("express");
const router = express.Router();
const { computePayment } = require("../controllers/index");

router.post("/split-payments/compute", computePayment);

module.exports = router;
