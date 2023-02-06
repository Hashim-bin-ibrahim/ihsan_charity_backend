const express = require("express");
const { SignUp, Login, Donate, getDetails, Beneficiary ,getDonationDetails} = require("../controllers/user");
const { RegisterValidation } = require("../validator");
const router = express.Router();

router.post("/signup", RegisterValidation, SignUp);
router.post("/login", RegisterValidation, Login);
router.post("/donate", Donate);
router.get("/getDetails", getDetails);
router.get("/getDonationDetails", getDonationDetails);
router.post("/addBeneficiary", Beneficiary);


module.exports = router;
