const express = require("express");

const router = express.Router();

const {handelDeleteFavoriteDataById,handelGetFavoriteDataByEmail,handelSaveFavoriteData} = require("../controllers/favorites");
const {verifyToken} = require("../middlewares/index");


  //favorites donation save ===================== 
        router.post("/",verifyToken,handelSaveFavoriteData);
    
        // get favorites donation
        router.get("/",verifyToken,handelGetFavoriteDataByEmail);
    
        // DELETE /favorites/:id
        router.delete("/:id",verifyToken,handelDeleteFavoriteDataById);

        module.exports = router;