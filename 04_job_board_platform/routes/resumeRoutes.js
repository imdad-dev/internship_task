const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { requireCandidateApi } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(requireCandidateApi);

router.get("/", resumeController.getMyResumes);
router.post("/", upload.single("resumeFile"), resumeController.uploadResume);
router.delete("/:id", resumeController.deleteResume);

module.exports = router;
