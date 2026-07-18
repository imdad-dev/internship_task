const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireAdminApi } = require("../middleware/auth");

router.get("/", requireAdminApi, orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.placeOrder); // public - customer places order
router.patch("/:id/status", requireAdminApi, orderController.updateOrderStatus);
router.patch("/:id/payment", requireAdminApi, orderController.updatePaymentStatus);
router.delete("/:id", requireAdminApi, orderController.deleteOrder);

module.exports = router;
