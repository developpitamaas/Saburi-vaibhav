const express = require("express");
const Offer = express.Router();
const Data = require("../controllers/Offer/bannercontroller");
const ExistOffer = require("../controllers/Offer/existingoffer");
const auth = require("../middleware/Auth");



// top banner
// create offer
Offer.route("/create-banner").post(Data.CreateBanner)

// get all offers
Offer.route("/get-all-banners").get(Data.GetAllBanner)

// get single offer
Offer.route("/get-single-banner/:id").get(Data.GetSingleBanner)

// update offer
Offer.route("/update-banner/:id").put(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.UpdateBanner)

// delete offer
Offer.route("/delete-banner/:id").delete(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,Data.DeleteBanner)


// existing offer
// create offer
Offer.route("/create-existing-banner").post(ExistOffer.CreateExisitingOfferBanner)

// get all offers
Offer.route("/get-all-existing-banners").get(ExistOffer.GetAllExisitingOfferBanner)

// get single offer
Offer.route("/get-single-existing-banner/:id").get(ExistOffer.GetSingleExisitingOfferBanner)

// delete offer
Offer.route("/delete-existing-banner/:id").delete(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,ExistOffer.DeleteExisitingOfferBanner)

// update offer
Offer.route("/update-existing-banner/:id").put(auth.IsAuthenticateUser,auth.authorizeRole("admin") ,ExistOffer.UpdateExisitingOfferBanner)


// exports
module.exports = Offer