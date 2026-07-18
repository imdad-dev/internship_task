const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { requireCandidateApi } = require("../middleware/auth");

router.put("/profile", requireCandidateApi, candidateController.updateProfile);

module.exports = router;
