const { StatusCodes } = require("http-status-codes");
const { nodemailer, Services } = require("../services");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const {
  Warehouse,
  Notification,
  Wallet,
  Booking,
  User,
  Transaction,
  WithdrawalRequest,
  Inquirer,
} = require("../models");

const WarehouseService = new Services(Warehouse);
const NotificationService = new Services(Notification);
const WalletService = new Services(Wallet);
const BookingService = new Services(Booking);
const UserService = new Services(User);
const TransactionService = new Services(Transaction);
const WithdrawalRequestService = new Services(WithdrawalRequest);
const InquirerService = new Services(Inquirer);

const dashboard = async (req, res) => {
  try {
    const warehouses = await WarehouseService.getMany({
      isDeleted: false,
    });
    const users = await UserService.getMany(
      { isDeleted: false },
    );
    const transactions = await TransactionService.getMany();
    const withdrawalRequests = await WithdrawalRequestService.getMany();

    // get the total transactions by adding the length of the transactions array and the withdrawal requests array
    const totalTransactions = transactions.length + withdrawalRequests.length;

    const totalRevenue = transactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);

    // sort the withdrawal requests by date, the most recent first
    const recent_withdrawal_request = withdrawalRequests.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        Total_Revenue: totalRevenue,
        Total_Transactions: totalTransactions,
        Total_payment_transactions: transactions.length,
        Total_withdrawal_transactions: withdrawalRequests.length,
        Total_users_number: users.length,
        Total_warehouses_number: warehouses.length,
        recent_withdrawal_request,
        original: users,
        original_users: users.filter(item => item.role === "spaceseeker"),
        original_owners: users.filter(item => item.role === "spaceowner"),
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    // get all the transactions
    const transactions = await TransactionService.getMany();

    // sort the transactions by date, the most recent first
    const space_seekers = transactions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const withdrawalRequests = await WithdrawalRequestService.getMany();

    // sort the withdrawal requests by date, the most recent first
    const space_owners = withdrawalRequests.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        space_seekers_data: space_seekers,
        space_owners_data: space_owners,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const approveTransaction = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const user = req.user;
    const withdrawalRequest = await WithdrawalRequestService.get(withdrawalId);
    if (!withdrawalRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    // get the customer's wallet
    const customer = await UserService.get(withdrawalRequest.customer);
    if (!customer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customerWallet = await WalletService.get(customer.wallet);
    if (!customerWallet) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Customer wallet not found",
      });
    }
    // reduce the customer's wallet balance by the withdrawal amount
    customerWallet.balance =
      Number(customerWallet.balance) - Number(withdrawalRequest.amount);
    await WalletService.update(customerWallet._id, customerWallet);

    const updatedWithdrawalRequest = await WithdrawalRequestService.update(
      withdrawalId,
      {
        status: "approved",
        approvedBy: user._id,
      }
    );

    const adminNotification = {
      admin: true,
      title: "Withdrawal request approved",
      message: `Withdrawal request with ID ${withdrawalId} has been approved`,
    };

    const ownerNotification = {
      user: customer.id,
      title: "Withdrawal request approved",
      message: `Your withdrawal request with ID ${withdrawalId} has been approved and will be processed shortly.`
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: updatedWithdrawalRequest,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const declineTransaction = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const user = req.user;
    const { declinedReason } = req.body;

    const updatedWithdrawalRequest = await WithdrawalRequestService.update(
      withdrawalId,
      {
        status: "declined",
        declinedReason,
        declinedBy: user._id,
      }
    );
    const adminNotification = {
      admin: true,
      title: "Withdrawal request Declined",
      message: `Withdrawal request with ID ${withdrawalId} has been declined by ${user.firstname}. decline reasons: ${declinedReason}`,
    };

    const ownerNotification = {
      user: customer.id,
      title: "Withdrawal equest declined",
      message: `Your withdrawal request with ID ${withdrawalId} has been declined. reason for decline: ${declinedReason}`
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: updatedWithdrawalRequest,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await TransactionService.get(transactionId);
    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Transaction not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getWithdrawalRequest = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const withdrawalRequest = await WithdrawalRequestService.get(withdrawalId);
    if (!withdrawalRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Withdrawal request not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: withdrawalRequest,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getSpaceOwners = async (req, res) => {
  try {
    // get all the users that have the role of spaceowners
    const users = await UserService.getMany({
      isDeleted: false,
      role: "spaceowner",
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getSpaceSeekers = async (req, res) => {
  try {
    // get all the users that have the role of spaceSeekers
    const users = await UserService.getMany({
      isDeleted: false,
      role: "spaceseeker",
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getWarehouses = async (req, res) => {
  try {
    // get all the warehouses
    const query = {
      isDeleted: false,
    };
    const warehouses = await WarehouseService.getMany(query);
    const active = warehouses.map((warehouse) => {
      if (warehouse.status === "active") {
        return warehouse;
      }
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.get(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    user.isBlocked = true;
    user.isSuspended = true;

    await UserService.update(userId, user);

    const adminNotification = {
      admin: true,
      title: "User blocked",
      message: `The user with ID ${userId} has been blocked by ${req.user.firstname}.`,
    };

    const ownerNotification = {
      user: userId,
      title: "Account blocked",
      message: `Your account has been blocked by an Admin ${req.user.firstname}. Please contact customer support for more information.`
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.get(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = false;
    user.isSuspended = false;

    await UserService.update(userId, user);

    const adminNotification = {
      admin: true,
      title: "User unblocked",
      message: `The user with ID ${userId} has been unblocked by ${req.user.firstname}.`,
    };

    const ownerNotification = {
      user: userId,
      title: "Account unblocked",
      message: `Your account has been unblocked by ${req.user.firstname}. You can now access your account.`
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.get(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    user.isDeleted = true;
    await UserService.update(userId, user);

    const adminNotification = {
      admin: true,
      title: "User Deleted",
      message: `User ${user.firstname} ${user.lastname} with ID ${user._id} has been deleted by an Admin ${req.user.firstname}.`,
    };
    await NotificationService.create(adminNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.get(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const activateWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    warehouse.isVerified = true;
    warehouse.status = "active";

    await WarehouseService.update(warehouseId, warehouse);

    const adminNotification = {
      admin: true,
      title: "Warehouse Activated",
      message: `Warehouse with ID ${warehouseId} has been activated by ${req.user.firstname}.`,
    };

    const ownerNotification = {
      user: warehouse.owner,
      title: "Warehouse Activated",
      message: `Your warehouse with ID ${warehouseId} has been activated and is now open for business.`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouse activated successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const blockWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    warehouse.isBlocked = true;
    warehouse.status = "inactive";

    await WarehouseService.update(warehouseId, warehouse);

    const adminNotification = {
      admin: true,
      title: "Warehouse blocked",
      message: `Warehouse with ID ${warehouseId} has been blocked by an admin.`,
    };

    const ownerNotification = {
      user: warehouse.owner,
      title: "Warehouse blocked",
      message: `Your warehouse with ID ${warehouseId} has been blocked. please contact the customer service`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouse blocked successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const unblockWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    warehouse.isBlocked = false;
    warehouse.status = "active";

    await WarehouseService.update(warehouseId, warehouse);

    const adminNotification = {
      admin: true,
      title: "Warehouse unblocked",
      message: `Warehouse with ID ${warehouseId} has been unblocked.`,
    };

    const ownerNotification = {
      user: warehouse.owner,
      title: "Warehouse unblocked",
      message: `Your warehouse with ID ${warehouseId} has been unblocked and is now active.`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouse unblocked successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    warehouse.isDeleted = true;
    await WarehouseService.update(warehouseId, warehouse);

    const adminNotification = {
      admin: true,
      title: "Warehouse deleted",
      message: `Warehouse with ID ${warehouseId} has been deleted.`,
    };

    await NotificationService.create(adminNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouse deleted successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const declineWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const reasonForDecline = req.body.reason;

    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    warehouse.isVerified = false;
    warehouse.isDeclined = true;
    warehouse.declinedReason = reasonForDecline;
    warehouse.declinedBy = req.user._id;

    await WarehouseService.update(warehouseId, warehouse);

    const adminNotification = {
      admin: true,
      title: "Warehouse declined",
      message: `Warehouse with ID ${warehouseId} has been declined by ${req.user.firstname}`,
    };

    const ownerNotification = {
      user: warehouse.owner,
      title: "Warehouse declined",
      message: `Your warehouse with ID ${warehouseId} has been declined for the reason: ${reasonForDecline}`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouse declined successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await InquirerService.getMany();
    let complaints = [];
    let potential_customers = [];

    inquiries.forEach((inquiry) => {
      if (inquiry.type === "complaint") {
        complaints.push(inquiry);
      } else {
        potential_customers.push(inquiry);
      }
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        complains: complaints,
        active_Email: potential_customers,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
const getInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const inquiry = await InquirerService.get(inquiryId);
    if (!inquiry) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Inquiry not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
const resolveEnquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const inquiry = await InquirerService.get(inquiryId);
    if (!inquiry) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Inquiry not found",
      });
    }
    inquiry.status = "resolved";
    inquiry.handledBy = req.user._id;

    await InquirerService.update(inquiryId, inquiry);

    const adminNotification = {
      admin: true,
      title: "Inquiry resolved",
      message: `Inquiry with ID ${inquiryId} has been resolved by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Inquiry resolved successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
const declineEnquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const inquiry = await InquirerService.get(inquiryId);
    if (!inquiry) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Inquiry not found",
      });
    }
    inquiry.status = "declined";
    inquiry.handledBy = req.user._id;
    inquiry.reason = req.body.reason;

    await InquirerService.update(inquiryId, inquiry);

    const adminNotification = {
      admin: true,
      title: "Inquiry declined",
      message: `Inquiry with ID ${inquiryId} has been declined by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Inquiry declined successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const inquiry = await InquirerService.delete(inquiryId);
    if (!inquiry) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Inquiry not found",
      });
    }
    const adminNotification = {
      admin: true,
      title: "Inquiry deleted",
      message: `Inquiry with ID ${inquiryId} has been deleted by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Inquiry deleted successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


const exportInquiriesToCsv = async (req, res) => {
  try {
    const inquiries = await InquirerService.getMany();
    const fields = [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "category", title: "Category" },
      { id: "phoneNumber", title: "Phone Number" },
      { id: "message", title: "Message" },
      { id: "type", title: "Type" },
      { id: "status", title: "Status" },
      { id: "handledBy", title: "Handled By" },
      { id: "reason", title: "Reason" },
      { id: "createdAt", title: "Created At" },
    ];
    const csvWriter = createCsvWriter({
      path: 'data.csv',
      header: fields,
    });
    const csvRecords = inquiries.map((obj) => {
      return {
        id: obj.id,
        name: obj.fullName,
        email: obj.email,
        category: obj.category,
        phoneNumber: obj.phoneNumber,
        message: obj.message,
        type: obj.type,
        status: obj.status,
        handledBy: obj.handledBy,
        reason: obj.reason,
        createdAt: obj.createdAt,
      };
    });
    await csvWriter.writeRecords(csvRecords);
    return res.download('data.csv');
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  dashboard,
  getTransactions,
  approveTransaction,
  declineTransaction,
  getTransaction,
  getWithdrawalRequest,
  getSpaceOwners,
  getSpaceSeekers,
  getUser,
  getWarehouses,
  blockUser,
  unblockUser,
  deleteUser,
  getWarehouse,
  activateWarehouse,
  blockWarehouse,
  unblockWarehouse,
  deleteWarehouse,
  declineWarehouse,
  getInquiries,
  getInquiry,
  resolveEnquiry,
  declineEnquiry,
  deleteEnquiry,
  exportInquiriesToCsv,
};
