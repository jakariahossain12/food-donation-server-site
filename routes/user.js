const express = require("express");

const router = express.Router();
const { verifyToken, adminVerify } = require("../middlewares/index");


const {
    handelGetUserByEmail,
    handelSaveUserData,
    getAllUsers,
    updateUserRole,
    deleteUser,
    updateUserRoleAndStatus,
} = require("../controllers/user")



    // user data save api
    router.post("/",handelSaveUserData);

    // user get by email user
    router.get("/",handelGetUserByEmail);

    router.patch("/", verifyToken, adminVerify, updateUserRole);

    router.delete("/", verifyToken, adminVerify, deleteUser);

    router.get("/all-user",verifyToken, adminVerify, getAllUsers);
    
    router.patch("/update-user-role", verifyToken, adminVerify, updateUserRoleAndStatus);



    module.exports = router;
