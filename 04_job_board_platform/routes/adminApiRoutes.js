const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdminApi } = require("../middleware/auth");

router.use(requireAdminApi);

router.get("/stats", adminController.getDashboardStats);
router.get("/top-jobs", adminController.getTopJobsByApplicants);
router.get("/jobs", adminController.getAllJobsAdmin);
router.get("/candidates", adminController.getAllCandidates);
router.get("/employers", adminController.getAllEmployers);
router.delete("/candidates/:id", adminController.deleteCandidate);
router.delete("/employers/:id", adminController.deleteEmployer);

module.exports = router;
