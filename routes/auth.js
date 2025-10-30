const express = require("express");
const router = express.Router();
const { generateJwtToken } = require("../controllers/auth");

router.post("/jwt-token", generateJwtToken);

module.exports = router;