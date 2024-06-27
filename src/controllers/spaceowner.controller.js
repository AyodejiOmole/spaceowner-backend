const {
  StatusCodes
} = require("http-status-codes");
const {
  nodemailer, Services,
} = require("../services");
const {
  Warehouse,
  Notification,
  Wallet,
  Booking,
  User,
  Transaction,
  WithdrawalRequest,
  Disabled,
} = require("../models");

const WarehouseService = new Services(Warehouse);
const NotificationService = new Services(Notification);
const WalletService = new Services(Wallet);
const BookingService = new Services(Booking);
const UserService = new Services(User);
const TransactionService = new Services(Transaction);
const WithdrawalRequestService = new Services(WithdrawalRequest);
const DisabledService = new Services(Disabled);

const createWarehouse = async (req, res) => {
  try {
    const { user } = req;
    if (!user.companyName || !user.NIN) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please complete your business profile",
      });
    }

    const operatingDays = req.body.operatingDays
      .split(",")
      .map((day) => day.trim());

    const days = operatingDays.reduce(
      (acc, day) => {
        acc[day] = true;
        return acc;
      },
      {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      }
    );

    const warehouse = {
      owner: req.user._id,
      ownerName: `${user.firstname} ${user.lastname}`,
      street: req.body.street,
      city: req.body.city.toLowerCase(),
      zipCode: req.body.zipCode,
      state: req.body.state,
      country: req.body.country,
      landmark: req.body.landmark,
      facilityAmenities: req.body.facilityAmenities,
      approvedProducts: req.body.approvedProducts,
      totalSpace: req.body.totalSpace,
      unitSize: req.body.unitSize,
      pricePerUnitPerYear: req.body.pricePerUnitPerYear,
      purpose: req.body.purpose,
      operatingDays: days,
      description: req.body.description,
      photos: req.body.photos,
      videos: req.body.videos,
      operatingHours: req.body.operatingHours,
      facilityRules: req.body.facilityRules,
      aboutTheOwner: req.body.aboutTheOwner,
      facilityName: req.body.facilityName,
      bankAccounts: req.body.bankAccounts,
      isVerified: false,
      agreedToTerms: req.body.agreedToTerms,
      contractDocument: req.body.contractDocument,
    };

    const newWarehouse = await WarehouseService.create(warehouse);

    if (!newWarehouse) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "warehouse not created",
      });
    }

    // send email to user
    const mailHtml = `<p>
      <h3>Hi ${user.firstname},</h3>
      <p>Thank you for creating a warehouse on our platform!</p>
      <p>Your warehouse is currently being reviewed by our team. You will be notified once it is approved.</p>
      <p>Thank you for choosing Warehouzit</p>
      <p>Best regards,Mr Olugbenga Ojo <br>
      CEO, WarehouzIt</p>
    </p>`;
    const subject = `
      Your warehouse has been created successfully
      `;
    const email = user.email;
    const option = {
      email,
      subject,
      mailHtml,
    };
    await nodemailer.send(option);

    const ownersNotification = {
      title: `Your warehouse has been created successfully`,
      user: user.id,
      message: `Your warehouse has been created successfully, it is currently being reviewed by our team. You will be notified once it is approved. Thank you for choosing Warehouzit.`,
    };
    const adminNotification = {
      admin: true,
      title: "warehouse has been created successfully",
      message: `warehouse with ID ${newWarehouse.id} has been created by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownersNotification);

    return res.status(StatusCodes.CREATED).json({
      message: "warehouse created successfully",
      newWarehouse,
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const createWarehouseAdmin = async (req, res) => {
  try {
    const { user } = req;
    // if (!user.companyName || !user.NIN) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     success: false,
    //     message: "Please complete your business profile",
    //   });
    // }

    const operatingDays = req.body.operatingDays
      .split(",")
      .map((day) => day.trim());

    const days = operatingDays.reduce(
      (acc, day) => {
        acc[day] = true;
        return acc;
      },
      {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      }
    );

    const warehouse = {
      owner: req.user._id,
      ownerName: `${user.firstname} ${user.lastname}`,
      street: req.body.street,
      city: req.body.city.toLowerCase(),
      zipCode: req.body.zipCode,
      state: req.body.state,
      country: req.body.country,
      landmark: req.body.landmark,
      facilityAmenities: req.body.facilityAmenities,
      approvedProducts: req.body.approvedProducts,
      totalSpace: req.body.totalSpace,
      unitSize: req.body.unitSize,
      pricePerUnitPerYear: req.body.pricePerUnitPerYear,
      purpose: req.body.purpose,
      operatingDays: days,
      description: req.body.description,
      photos: req.body.photos,
      videos: req.body.videos,
      operatingHours: req.body.operatingHours,
      facilityRules: req.body.facilityRules,
      aboutTheOwner: req.body.aboutTheOwner,
      facilityName: req.body.facilityName,
      bankAccounts: req.body.bankAccounts,
      isVerified: false,
      agreedToTerms: req.body.agreedToTerms,
      contractDocument: req.body.contractDocument,
    };

    const newWarehouse = await WarehouseService.create(warehouse);

    if (!newWarehouse) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "warehouse not created",
      });
    }

    // send email to user
    const mailHtml = `<p>
      <h3>Hi ${user.firstname},</h3>
      <p>Thank you for creating a warehouse on our platform!</p>
      <p>Your warehouse is currently being reviewed by our team. You will be notified once it is approved.</p>
      <p>Thank you for choosing Warehouzit</p>
      <p>Best regards,Mr Olugbenga Ojo <br>
      CEO, WarehouzIt</p>
    </p>`;
    const subject = `
      Your warehouse has been created successfully
      `;
    const email = user.email;
    const option = {
      email,
      subject,
      mailHtml,
    };
    await nodemailer.send(option);

    const ownersNotification = {
      title: `Your warehouse has been created successfully`,
      user: user.id,
      message: `Your warehouse has been created successfully, it is currently being reviewed by our team. You will be notified once it is approved. Thank you for choosing Warehouzit.`,
    };
    const adminNotification = {
      admin: true,
      title: "warehouse has been created successfully",
      message: `warehouse with ID ${newWarehouse.id} has been created by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownersNotification);

    return res.status(StatusCodes.CREATED).json({
      message: "warehouse created successfully",
      newWarehouse,
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const dashboard = async (req, res) => {
  try {
    const { user } = req;

    let allBookings = [];
    const warehouses = await WarehouseService.getMany({
      owner: user._id,
      isDeleted: false,
    });
    const findAllBookings = warehouses.map(async (warehouse) => {
      const bookings = await BookingService.getMany({
        warehouse: warehouse._id,
      });
      allBookings = [...allBookings, ...bookings];
    });
    await Promise.all(findAllBookings);
    const totalBookings = allBookings.length;
    const totalWarehouses = warehouses.length;
    const activeWarehouses = warehouses.filter(
      (warehouse) => warehouse.isAvailable === true
    ).length;

    // Total Revenue
    const walletId = user.wallet;
    const totalRevenue = await WalletService.get(walletId);
    const totalRevenueAmount = totalRevenue.balance;

    // in the allBookings array, loop through and get the customers id and push to an array
    // then loop through the array and get the customer details and push to an array

    const customers = [];
    const getCustomers = allBookings.map(async (booking) => {
      let customer = await UserService.get(booking.customer);
      const {
        _id,
        startDate,
        endDate,
        totalCost,
        rentedSize,
        status
      } = booking;

      customers.push({
        _id,
        customer: customer.username,
        startDate,
        endDate,
        totalCost,
        rentedVolume: rentedSize,
        status
      });
    });

    await Promise.all(getCustomers);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        noOfWarehousesListed: totalWarehouses,
        noOfEngagements: totalBookings,
        noOfWarehousesActive: activeWarehouses,
        totalRevenue: totalRevenueAmount,

        warehouses: warehouses.map((warehouse) => {
          const {
            _id,
            facilityName,
            totalSpace,
            pricePerUnitPerYear,
            city,
            country,
            isAvailable,
          } = warehouse;
          return {
            _id,
            facilityName,
            availableSpace: totalSpace,
            pricePerSquareMeter: pricePerUnitPerYear,
            city,
            country,
            isAvailable,
          };
        }),
        Engagements: customers,
      },
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
    const { user } = req;
    const warehouses = await WarehouseService.getMany({
      owner: user._id,
      isDeleted: false,
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouses retrieved successfully",
      data: warehouses,
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
      message: "Warehouse retrieved successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// const toggleAvailability = async (req, res) => {
//   try {
//     const { warehouseId } = req.params;

//     const warehouse = await WarehouseService.get(warehouseId);
//     if (!warehouse) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "Warehouse not found, please check the warehouse ID and try again",
//       });
//     }

//     const checkIsDisabled = await Disabled.exists(
//       {
//         user: warehouse.owner,
//         warehouse: warehouse._id,
//       }
//     );

//     if (checkIsDisabled) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "this warehouse has been toggled within the last 24",
//       });
//     }

//     const { isAvailable } = warehouse;

//     const updatedWarehouse = await WarehouseService.update(warehouseId, {
//       isAvailable: !isAvailable,
//     });

//     const disableObj = {
//       user: warehouse.owner,
//       warehouse: warehouse._id,
//     };

//     await DisabledService.create(disableObj);

//     const adminNotification = {
//       admin: true,
//       title: "Warehouse availability changed",
//       message: `Warehouse with ID ${warehouseId} has had its availability toggled by ${req.user.firstname}`,
//     };
//     const ownerNotification = {
//       user: warehouse.owner,
//       title: "Warehouse availability changed",
//       message: `Your warehouse with ID ${warehouseId} has had its availability toggled by ${req.user.firstname}`,
//     };

//     await NotificationService.create(adminNotification);
//     await NotificationService.create(ownerNotification);

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Availability toggle successful",
//       warehouse: updatedWarehouse,
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       error: error.message,
//       message: "An error occurred while toggling warehouse availability. Please try again later or contact support if the error persists."
//     });
//   }
// };

const toggleAvailability = async (req, res) => {
  try {
    const { warehouseId } = req.params;

    const warehouse = await WarehouseService.get(warehouseId);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found, please check the warehouse ID and try again",
      });
    }

    const disableObj = await Disabled.findOne(
      { user: warehouse.owner, warehouse: warehouse._id },
      {},
      { sort: { createdAt: -1 } }
    );

    if (disableObj) {
      const now = new Date();
      const timeSinceDisable = now - disableObj.createdAt;
      const timeRemaining = Math.ceil((24 * 60 * 60 * 1000 - timeSinceDisable) / 1000);

      if (timeRemaining > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: `This warehouse has been toggled within the last 24 hours. Please wait for ${Math.ceil(timeRemaining / 3600)} hours and try again.`,
        });
      }
    }

    const { isAvailable } = warehouse;

    const updatedWarehouse = await WarehouseService.update(warehouseId, {
      isAvailable: !isAvailable,
    });

    await DisabledService.create({ user: warehouse.owner, warehouse: warehouse._id });

    const adminNotification = {
      admin: true,
      title: "Warehouse availability changed",
      message: `Warehouse with ID ${warehouseId} has had its availability toggled by ${req.user.firstname}`,
    };
    const ownerNotification = {
      user: warehouse.owner,
      title: "Warehouse availability changed",
      message: `Your warehouse with ID ${warehouseId} has had its availability toggled by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Availability toggle successful",
      warehouse: updatedWarehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "An error occurred while toggling warehouse availability. Please try again later or contact support if the error persists."
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
    const deletedWarehouse = await WarehouseService.update(warehouseId, {
      isDeleted: true,
      isAvailable: false,
      isVerified: false,
    });

    const adminNotification = {
      admin: true,
      title: "Warehouse deleted",
      message: `Warehouse with ID ${warehouseId} has been deleted by ${req.user.firstname}`,
    };

    await NotificationService.create(adminNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Warehouse deleted successfully",
      warehouse: deletedWarehouse,
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
    const { user } = req;
    const { wallet } = user;
    const usersWallet = await WalletService.get(wallet);
    const { transactions } = usersWallet;

    const getTransactions = transactions.map(async (transaction) => {
      const transactionDetails = await TransactionService.get(transaction);
      const {
        _id,
        amount,
        status,
        createdAt,
        rentedSize,
      } = transactionDetails;

      const dateFromCreatedAt = new Date(createdAt);
      const date = dateFromCreatedAt.toLocaleDateString();
      const time = dateFromCreatedAt.toLocaleTimeString();

      console.log({
        date,
        time,
      });

      return {
        _id,
        time,
        date,
        amount,
        status,
        rentedVolume: rentedSize,
      };
    });

    // get all withdrawals
    let allWithdrawals = await WithdrawalRequestService.getMany({
      customer: user._id,
    });

    allWithdrawals = allWithdrawals.map((withdrawal) => {
      const {
        _id,
        amount,
        status,
        createdAt
      } = withdrawal;

      const dateFromCreatedAt = new Date(createdAt);
      const date = dateFromCreatedAt.toLocaleDateString();
      const time = dateFromCreatedAt.toLocaleTimeString();

      return {
        _id,
        time,
        date,
        amount,
        status,
      };
    });

    const allTransactions = await Promise.all(getTransactions);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Transactions retrieved successfully",
      paymentReceived: allTransactions,
      withdrawalRequests: allWithdrawals,
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
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getCardDetails = async (req, res) => {
  try {
    const { user } = req;
    // find all the warehouses owned by the user
    const warehouses = await WarehouseService.getMany({
      owner: user._id,
      isDeleted: false,
    });
    // get all the card details for each warehouse
    let allBankAccounts = [];
    warehouses.map((warehouse) => {
      const { bankAccounts } = warehouse;
      allBankAccounts = [...allBankAccounts, ...bankAccounts];
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Card details retrieved successfully",
      data: allBankAccounts,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const withdrawalRequest = async (req, res) => {
  try {
    const { user } = req;
    const { bank, accountNumber, amount } = req.body;
    // get the user's wallet
    const { wallet } = user;
    const usersWallet = await WalletService.get(wallet);
    let { balance } = usersWallet;
    // check if the amount to be withdrawn is greater than the balance
    if (amount > balance) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Insufficient funds",
      });
    }
    // create a new withdrawal request
    const newWithdrawalRequest = await WithdrawalRequestService.create({
      bank,
      accountNumber,
      amount,
      customer: user._id,
      customer_name: `${user.firstname} ${user.lastname}`,
      status: "pending",
      accountBalance: balance,
    });

    // update the user's wallet
    const datum = {
      balance: Number(balance) - Number(amount),
    };

    await WalletService.update(wallet, datum);

    const adminNotification = {
      admin: true,
      title: "New withdrawal request",
      message: `A new withdrawal request for ${amount} has been made by ${user.firstname} ${user.lastname}.`,
    };

    const ownerNotification = {
      user: user.id,
      title: "Withdrawal request",
      message: `Your withdrawal request for ${amount} has been received and is being processed.`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Withdrawal request created successfully",
      data: newWithdrawalRequest,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const addCardDetails = async (req, res) => {
  try {
    const { user } = req;
    const { bank, accountNumber } = req.body;
    // get all warehouses owned by the user
    const warehouses = await WarehouseService.getMany({
      owner: user._id,
      isDeleted: false,
    });
    // get the last warehouse
    const warehouse = warehouses[warehouses.length - 1];
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    const warehouseId = warehouse._id;
    const { bankAccounts } = warehouse;
    const newBankAccount = {
      bank,
      accountNumber,
    };
    const updatedBankAccounts = [...bankAccounts, newBankAccount];
    const updatedWarehouse = await WarehouseService.update(warehouseId, {
      bankAccounts: updatedBankAccounts,
    });

    const adminNotification = {
      admin: true,
      title: "New bank account added",
      message: `A new bank account with ${bank} ${accountNumber} has been added to warehouse ${warehouseId} by ${user.firstname} ${user.lastname}.`,
    };

    const ownerNotification = {
      user: user.id,
      title: "New bank account added",
      message: `A new bank account with ${bank} ${accountNumber} has been added to your warehouse.`,
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Card details added successfully",
      data: updatedWarehouse,
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
      message: "Withdrawal request retrieved successfully",
      data: withdrawalRequest,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createWarehouse,
  createWarehouseAdmin,
  dashboard,
  getWarehouses,
  getWarehouse,
  toggleAvailability,
  deleteWarehouse,
  getTransactions,
  getTransaction,
  getCardDetails,
  addCardDetails,
  withdrawalRequest,
  getWithdrawalRequest
};
