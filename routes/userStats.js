const express = require("express");
const router = express.Router();
const { getUserStats } = require("../controllers/userStats");

router.get("/:email", getUserStats);

module.exports = router;