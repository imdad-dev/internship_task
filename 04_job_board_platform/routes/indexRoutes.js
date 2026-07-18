const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

router.get("/", pageController.renderHome);
router.get("/jobs", pageController.renderJobsPage);
router.get("/jobs/:id", pageController.renderJobDetail);
router.get("/about", pageController.renderAbout);

module.exports = router;
