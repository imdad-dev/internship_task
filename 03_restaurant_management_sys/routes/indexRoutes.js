const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

router.get("/", pageController.renderHome);
router.get("/menu", pageController.renderMenuPage);
router.get("/reserve", pageController.renderReservePage);
router.get("/order-success/:id", pageController.renderOrderSuccess);
router.get("/about", pageController.renderAbout);

module.exports = router;
