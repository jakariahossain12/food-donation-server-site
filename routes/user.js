const express = require("express");

const router = express.Router();

const {handelGetUserByEmail,handelSaveUserData} = require("../controllers/user")



    // user data save api
    router.post("/",handelSaveUserData);

    // user get by email user
    router.get("/",handelGetUserByEmail);


    module.exports = router;
