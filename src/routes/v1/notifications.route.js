const express = require("express");
const router = express.Router();
const { notificationController } = require("../../controllers");

router.get("/", notificationController.getNotifications);
router.get("/admin", notificationController.ADMINgetNotifications);

router.get("/unread", notificationController.getUnreadNotifications);
router.get("/admin/unread", notificationController.ADMINgetUnreadNotifications);

router.put("/mark-as-read", notificationController.markAllAsread);
router.put("/admin/mark-as-read", notificationController.ADMINmarkAllAsread);

router.get("/:id", notificationController.getNotification);
router.get("/admin/:id", notificationController.ADMINgetNotification);

router.put("/:id/mark-as-read", notificationController.markAsRead);
router.put("/admin/:id/mark-as-read", notificationController.ADMINmarkAsRead);

router.delete("/", notificationController.deleteAllNotifications);
router.delete("/admin", notificationController.ADMINdeleteAllNotifications);
router.delete("/:id", notificationController.deleteNotification);
router.delete("/admin/:id", notificationController.ADMINdeleteNotification);

module.exports = router;
