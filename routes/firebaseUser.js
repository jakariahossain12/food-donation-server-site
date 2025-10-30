const express = require("express");
const router = express.Router();
const { verifyToken, adminVerify } = require("../middlewares/index");
const { deleteFirebaseUser } = require("../controllers/firebaseUser");

router.delete("/delete/:uid", verifyToken, adminVerify, deleteFirebaseUser);

module.exports = router;