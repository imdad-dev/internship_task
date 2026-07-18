const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { requireEmployerApi } = require("../middleware/auth");

router.get("/mine", requireEmployerApi, jobController.getMyJobs); // must precede /:id
router.get("/stats", requireEmployerApi, jobController.getEmployerStats); // must precede /:id
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);
router.post("/", requireEmployerApi, jobController.createJob);
router.put("/:id", requireEmployerApi, jobController.updateJob);
router.patch("/:id/toggle-status", requireEmployerApi, jobController.toggleJobStatus);
router.delete("/:id", requireEmployerApi, jobController.deleteJob);

module.exports = router;
