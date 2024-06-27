const { Notification } = require('../models');
const { StatusCodes } = require("http-status-codes");

const {
  Services
} = require('../services');

const NotificationService = new Services(Notification);

const getNotifications = async (req, res) => {
  try {
    const id = req.user._id;
    const notifications = await NotificationService.getMany({ user: id });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getUnreadNotifications = async (req, res) => {
  try {
    const id = req.user._id;
    const notifications = await NotificationService.getMany({
      user: id,
      isRead: false,
    });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await NotificationService.get(id);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const markAllAsread = async (req, res) => {
  try {
    const id = req.user._id;
    const notifications = await NotificationService.getMany({ user: id });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    notifications.forEach(async (notification) => {
      await NotificationService.update(notification._id, {
        isRead: true,
      });
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications marked as read successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await NotificationService.get(id);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification not found",
      });
    }

    await NotificationService.update(id, { isRead: true });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification marked as read successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await NotificationService.get(id);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification not found",
      });
    }

    await NotificationService.delete(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const id = req.user._id;
    const notifications = await NotificationService.getMany({ user: id });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    notifications.forEach(async (notification) => {
      await NotificationService.delete(notification._id);
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINgetNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "you are not an admin",
      });
    }
    const notifications = await NotificationService.getMany({ admin: true });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINgetUnreadNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "you are not an admin",
      });
    }
    const notifications = await NotificationService.getMany({
      admin: true,
      isRead: false,
    });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINgetNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await NotificationService.get(id);

    if (!notification || notification.admin !== true) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification for admin not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINmarkAllAsread = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "you are not an admin",
      });
    }
    const notifications = await NotificationService.getMany({ admin: true });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    notifications.forEach(async (notification) => {
      await NotificationService.update(notification._id, {
        isRead: true,
      });
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications marked as read successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINmarkAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await NotificationService.get(id);

    if (!notification || notification.admin !== true) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification for admin not found",
      });
    }

    await NotificationService.update(id, { isRead: true });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification marked as read successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINdeleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await NotificationService.get(id);

    if (!notification || notification.admin !== true) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification for admin not found",
      });
    }

    await NotificationService.delete(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const ADMINdeleteAllNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "you are not an admin",
      });
    }
    const notifications = await NotificationService.getMany({ admin: true });

    if (!notifications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "your notifications are empty",
      });
    }

    notifications.forEach(async (notification) => {
      await NotificationService.delete(notification._id);
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  getNotification,
  markAllAsread,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  ADMINgetNotifications,
  ADMINgetUnreadNotifications,
  ADMINgetNotification,
  ADMINmarkAllAsread,
  ADMINmarkAsRead,
  ADMINdeleteNotification,
  ADMINdeleteAllNotifications,
};
