const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { requireAdminApi } = require("../middleware/auth");

router.get("/", menuController.getAllMenuItems);
router.get("/:id", menuController.getMenuItemById);
router.post("/", requireAdminApi, menuController.createMenuItem);
router.put("/:id", requireAdminApi, menuController.updateMenuItem);
router.patch("/:id/toggle", requireAdminApi, menuController.toggleAvailability);
router.delete("/:id", requireAdminApi, menuController.deleteMenuItem);

module.exports = router;
