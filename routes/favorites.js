const express = require("express");

const router = express.Router();

const {handelDeleteFavoriteDataById,handelGetFavoriteDataByEmail,handelSaveFavoriteData} = require("../controllers/favorites");


  //favorites donation save ===================== after add verify token function
        router.post("/",handelSaveFavoriteData);
    
        // get favorites donation
        router.get("/",handelGetFavoriteDataByEmail);
    
        // DELETE /favorites/:id
        router.delete("/:id",handelDeleteFavoriteDataById);


        module.exports = router;