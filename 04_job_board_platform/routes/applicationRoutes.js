const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { requireCandidateApi, requireEmployerApi } = require("../middleware/auth");

router.post("/", requireCandidateApi, applicationController.applyToJob);
router.get("/mine", requireCandidateApi, applicationController.getMyApplications);
router.get("/job/:jobId", requireEmployerApi, applicationController.getApplicationsForJob);
router.patch("/:id/status", requireEmployerApi, applicationController.updateApplicationStatus);

module.exports = router;
