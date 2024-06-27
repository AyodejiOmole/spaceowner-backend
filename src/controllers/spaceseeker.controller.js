const {
  StatusCodes
} = require("http-status-codes");
const {
  nodemailer,
  Services,
  PaystackService
} = require("../services");
const {
  transaction
} = require('../utils');

const {
  Warehouse,
  User,
  Booking,
  Notification,
  Wallet,
  Transaction,
  Disabled
} = require("../models");

const WarehouseService = new Services(Warehouse);
const UserService = new Services(User);
const BookingService = new Services(Booking);
const NotificationService = new Services(Notification);
const WalletService = new Services(Wallet);
const TransactionService = new Services(Transaction);
const DisabledService = new Services(Disabled);

const searchWarehouses = async (req, res) => {
  try {
    // const zipCode = req.query.zipcode ? req.query.zipcode : "";
    // const city = req.query.city ? req.query.city : "";
    // const state = req.query.state ? req.query.state : "";
    // const queryObj = {};
    // let result;

    // if (zipCode) {
    //   queryObj.zipCode = zipCode;
    //   queryObj.isVerified = true;
    //   result = await Warehouse.find(queryObj);
    // }
    // const queryObj = {
    //   // isVerified: true,
    //   $or: [
    //     { city },
    //     { zipCode },
    //     { state }
    //   ]
    // };

    const location = req.query.location ? req.query.location.toLowerCase() : "";

    // const queryObj = {
    //   isVerified: true,
    //   $or: [
    //     { zipCode: location },
    //     { city: location },
    //     { state: location }
    //   ]
    // };
    
    // Perform separate queries for zip code, city, and state
    const queryZip = { isVerified: true, zipCode: location };
    const queryCity = { isVerified: true, city: location };
    const queryState = { isVerified: true, state: location };

    // const resultsZip = await Warehouse.find(queryZip);
    // const resultsCity = await Warehouse.find(queryCity);
    // const resultsState = await Warehouse.find(queryState);

    const [resultsZip, resultsCity, resultsState] = await Promise.all([
      Warehouse.find(queryZip),
      Warehouse.find(queryCity),
      Warehouse.find(queryState)
    ]);

    // Merge the results
    let result = [...resultsZip, ...resultsCity, ...resultsState];

    // if (city) {
    //   queryObj.city = city.toLowerCase();
    // }

    // if (state) {
    //   queryObj.state = state.toLowerCase();
    // }

     // If no results found by zipCode, search by city
    // if (!result && city) {
    //   delete queryObj.zipCode;
    //   queryObj.city = city; // Reset city query
    //   queryObj.isVerified = true;
    //   result = await Warehouse.find(queryObj);
    // }

    // If no results found by city or zip code, search by state
    // if (!result && state) {
    //   delete queryObj.city; // Reset zip code query
    //   queryObj.state = state;
    //   queryObj.isVerified = true;
    //   result = await Warehouse.find(queryObj);
    // }

    // queryObj.isVerified = true;
    // let result = Warehouse.find(queryObj);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // result = result.skip(startIndex).limit(limit);
    result = result.slice(startIndex, startIndex + limit);

    // if (req.query.sortByPrice == "asc") {
    //   result = result.sort({
    //     pricePerUnitPerYear: 1
    //   });
    // } else if (req.query.sortByPrice == "desc") {
    //   result = result.sort({
    //     pricePerUnitPerYear: -1
    //   });
    // } else if (req.query.sortByRating == "asc") {
    //   result = result.sort({
    //     averageRating: 1
    //   });
    // } else if (req.query.sortByRating == "desc") {
    //   result = result.sort({
    //     averageRating: -1
    //   });
    // } else {
    //   result = result.sort({
    //     createdAt: -1
    //   });
    // }
    // result = result.sort({
    //   createdAt: -1
    // });
    if (req.query.sortByPrice == "asc") {
      result = result.sort((a, b) => a.pricePerUnitPerYear - b.pricePerUnitPerYear);
    } else if (req.query.sortByPrice == "desc") {
      result = result.sort((a, b) => b.pricePerUnitPerYear - a.pricePerUnitPerYear);
    } else if (req.query.sortByRating == "asc") {
      result = result.sort((a, b) => a.averageRating - b.averageRating);
    } else if (req.query.sortByRating == "desc") {
      result = result.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      result = result.sort((a, b) => b.createdAt - a.createdAt);
    }

    // const warehouses = await result;
    const warehouses = result;
    
    return res.status(StatusCodes.OK).json({
      message: "Warehouses retrieved successfully",
      data: warehouses,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// const searchWarehouses = async (req, res) => {
//   try {
//     const zipCode = req.query.zipcode ? req.query.zipcode : "";
//     const city = req.query.city ? req.query.city : "";
//     const queryObj = {};

//     if (zipCode) {
//       queryObj.zipCode = zipCode;
//     }

//     if (city) {
//       queryObj.city = city.toLowerCase();
//     }

//     queryObj.isVerified = true;
//     let result = Warehouse.find(queryObj);

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const startIndex = (page - 1) * limit;

//     result = result.skip(startIndex).limit(limit);

//     if (req.query.sortByPrice == "asc") {
//       result = result.sort({
//         pricePerUnitPerYear: 1
//       });
//     } else if (req.query.sortByPrice == "desc") {
//       result = result.sort({
//         pricePerUnitPerYear: -1
//       });
//     } else if (req.query.sortByRating == "asc") {
//       result = result.sort({
//         averageRating: 1
//       });
//     } else if (req.query.sortByRating == "desc") {
//       result = result.sort({
//         averageRating: -1
//       });
//     } else {
//       result = result.sort({
//         createdAt: -1
//       });
//     }
//     result = result.sort({
//       createdAt: -1
//     });

//     const warehouses = await result;

//     return res.status(StatusCodes.OK).json({
//       message: "Warehouses retrieved successfully",
//       data: warehouses,
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message,
//     });
//   }
// };

const getWarehouse = async (req, res) => {
  try {
    const warehouse = await WarehouseService.get(req.params.id);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Warehouse not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Warehouse retrieved successfully",
      data: warehouse,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const calculate = async (req, res) => {
  try {
    // get the warehouse
    const warehouse = await WarehouseService.get(req.params.id);
    if (!req.query.startDate || !req.query.endDate || !req.query.spaceToRent || !req.query.pricingPlan) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const {
      startDate,
      endDate,
      spaceToRent,
      pricingPlan
    } = req.query;
    // handle error
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Warehouse not found",
      });
    }
    const pricePerUnitPerYear = warehouse.pricePerUnitPerYear;


    const start = new Date(startDate);
    const end = new Date(endDate);
    const space = end - start;
    if (space < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide a valid date range",
      });
    }
    const diffTime = Math.abs(space);


    const noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const noOfMonths = Math.ceil(noOfDays / 30);
    const noOfYears = Math.ceil(noOfMonths / 12);


    let totalCost;

    if (pricingPlan == "monthly") {
      totalCost = transaction.costForMonthly(pricePerUnitPerYear, spaceToRent, noOfMonths);
    }

    if (pricingPlan == "yearly") {
      if (noOfDays > 360) {
        totalCost = transaction.costForYearly(pricePerUnitPerYear, spaceToRent, noOfYears);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "choose the monthly price plan, your date range is not up to a year",
        });
      }
    }
    const transactionFee = transaction.transactionFee(totalCost);
    const sumTotalCost = transaction.totalCost(totalCost, transactionFee);

    return res.status(StatusCodes.OK).json({
      cost_for_space: totalCost,
      transacton_fee: transactionFee,
      total_cost: sumTotalCost
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const reserveIt = async function (req, res) {
  try {
    const warehouse = await WarehouseService.get(req.params.id);

    const {
      startDate,
      endDate,
      spaceToRent,
      pricingPlan,
      spaceCost,
      transactionFee,
      totalCost
    } = req.body;

    if (!startDate || !endDate || !spaceToRent || !pricingPlan || !spaceCost || !transactionFee || !totalCost) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide all the required fields",
      });
    }

    const rentedSize = Number(spaceToRent);

    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Warehouse not found",
      });
    }

    // check if the warehouse is available
    if (warehouse.isAvailable !== true) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Warehouse not available",
      });
    }

    // check if the warehouse is already booked
    if (spaceToRent > warehouse.totalSpace) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: " not enough space in warehouse ",
      });
    }

    const customer = req.user;
    if (!customer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }
    const warehouseOwner = await UserService.get(warehouse.owner);
    if (!warehouseOwner) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Warehouse owner not found",
      });
    }

    const newBooking = {
      startDate,
      endDate,
      warehouse: warehouse.id,
      warehouseName: warehouse.facilityName,
      customer: customer.id,
      status: "pending",
      rentedSize,
      pricingPlan,
      spaceCost,
      totalCost,
      transactionFee,
    };

    const booking = await BookingService.create(newBooking);

    if (!booking) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Booking not created",
      });
    }

    warehouse.bookings.push(booking.id);
    warehouseOwner.bookings.push(booking.id);
    customer.bookings.push(booking.id);

    await WarehouseService.update(warehouse.id, warehouse);
    await UserService.update(warehouseOwner.id, warehouseOwner);
    await UserService.update(customer.id, customer);


    // send email and notification to the warehouse owner
    const warehouseOwnerMailSubject = `
    new engaement on your warehouse ${warehouse.facilityName}`;
    const warehouseOwnerMail = `<p>
    Dear <strong>${warehouseOwner.username}</strong>, <br>
    <br> A new engagement has been made on your warehouse <strong>${warehouse.facilityName}</strong> <br> We believe this could be the start of a great business opportunity and hope that this leads to a successful collaboration between you and the visitor.

    Please do not hesitate to contact us if you require any further assistance.
    <br>
    <br>
    Best regards,Mr Olugbenga Ojo <br>
    CEO, WarehouzIt 
    </p>
    `;

    const emailForWarehouseOwner = {
      email: warehouseOwner.email,
      subject: warehouseOwnerMailSubject,
      mailHtml: warehouseOwnerMail,
    };

    await nodemailer.send(emailForWarehouseOwner);

    // send email and notification to the warehouser customer
    const customerMailSubject = `Your booking has been created successfully for the warehouse ${warehouse.facilityName}`;

    const customerMail = `<p> Dear <strong>${customer.username}</strong>, <br>
    <br> Your booking has been created successfully. 

    Your booking payment status is <strong>pending,</strong>please make payment for your booking. <br>

    your booking will be confirmed once payment is made. <br> or it would be cancelled if payment is not made within 24 hours. <br>
    
    <br> We believe this could be the start of a great business opportunity and hope that this leads to a successful collaboration between you and the warehouse owner.

    Please do not hesitate to contact us if you require any further assistace.
    <br>
    <br>
    Best regards,Mr Olugbenga Ojo <br>
    CEO, WarehouzIt 
    </p>
    `;

    const emailForCustomer = {
      email: customer.email,
      subject: customerMailSubject,
      mailHtml: customerMail,
    };

    await nodemailer.send(emailForCustomer);

    const notificationForWarehouseOwner = {
      user: warehouseOwner.id,
      title: "New engaement on your warehouse",
      message: `a new engagement on your warehouse ${warehouse.facilityName} has been made`,
    };

    const notificationForCustomer = {
      user: customer.id,
      title: "Booking created successfully",
      message: `Your booking has been created successfully for the warehouse ${warehouse.facilityName}. please make your payment before 24 hours to avoid cancellation of your booking`,
    };

    const adminNotification = {
      admin: true,
      title: "Booking created",
      message: `a booking with the id ${booking.id} has been created for warehouse ${warehouse.facilityName}, by ${req.user.firstname} `,
    };

    await NotificationService.create(notificationForWarehouseOwner);
    await NotificationService.create(notificationForCustomer);
    await NotificationService.create(adminNotification);


    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking created successfully",
      bookingId: booking.id,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelReservation = async function (req, res) {
  try {
    const bookingId = req.params.id;
    const booking = await BookingService.get(bookingId);
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found",
      });
    }

    const customer = req.user;
    if (!customer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    if (booking.customer.toString() !== customer.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "You are not authorized to cancel this booking",
      });
    }

    const warehouse = await WarehouseService.get(booking.warehouse);
    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Warehouse not found",
      });
    }


    const warehouseOwner = await UserService.get(warehouse.owner);
    if (!warehouseOwner) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Warehouse owner not found",
      });
    }

    if (booking.paymentStatus == "paid") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Booking already paid for, cannot be cancelled directly, please contact our support team"
      });
    }

    if (booking.status == "cancelled") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Booking already cancelled",
      });
    }

    booking.status = "cancelled";

    await BookingService.update(booking.id, booking);
    await WarehouseService.update(warehouse.id, warehouse);
    await UserService.update(warehouseOwner.id, warehouseOwner);
    await UserService.update(customer.id, customer);

    // send email and notification to the warehouse owner
    const warehouseOwnerMailSubject = `
    Engagement on your warehouse ${warehouse.facilityName} has been cancelled
    `;
    const warehouseOwnerMail = `
    <p>
    Dear <strong>${warehouseOwner.firstname} ${warehouseOwner.lastname}</strong>, <br> 
    <br> an engagement on your warehouse ${warehouse.facilityName} has been cancelled <br> We believe this could be the start of a great business opportunity and hope that this leads to a successful collaboration between you and the visitor.

    Please do not hesitate to contact us if you
    require any further assistance.
    <br>
    <br>

    Best regards,Mr Olugbenga Ojo <br>
    CEO, WarehouzIt

    </p>
    `;

    const emailForWarehouseOwner = {
      email: warehouseOwner.email,
      subject: warehouseOwnerMailSubject,
      mailHtml: warehouseOwnerMail,
    };

    await nodemailer.send(emailForWarehouseOwner);

    // send email and notification to the warehouser customer
    const customerMailSubject = `
    <p>Your booking has been cancelled successfully for the warehouse ${warehouse.facilityName} </p>
    `;
    const customerMail = `
    <p>
    Dear <strong>${customer.firstname} ${customer.lastname}</strong> <br>,
    <br> Your booking has been cancelled successfully.
    <br> We believe this could be the start of a great business opportunity and hope that this leads to a successful collaboration between you and the warehouse owner.

    Please do not hesitate to contact us if you require any further assistace.
    </p>
    `;
    const emailForCustomer = {
      email: customer.email,
      subject: customerMailSubject,
      mailHtml: customerMail,
    };

    await nodemailer.send(emailForCustomer);

    const notificationForWarehouseOwner = {
      user: warehouseOwner.id,
      title: "engagement on your warehouse has been cancelled",
      message: `engagement on your warehouse ${warehouse.facilityName} has been cancelled`,
    };

    const notificationForCustomer = {
      user: customer.id,
      title: "Booking cancelled successfully",
      message: `Your booking has been cancelled successfully for the warehouse ${warehouse.facilityName}.`,
    };

    await NotificationService.create(notificationForWarehouseOwner);
    await NotificationService.create(notificationForCustomer);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const payNow = async function (req, res) {
  try {
    const customer = req.user;
    const bookingId = req.params.id;

    const email = customer.email;
    const booking = await BookingService.get(bookingId);
    const amount = booking.totalCost;

    const callback_url = `https://warehouzitserver.onrender.com/api/v1/payment/verify/${booking.id}`;

    const metadata = booking;

    const response = await PaystackService.initializePayment({
      amount,
      email,
      callback_url,
      metadata
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment initialized",
      data: response.data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async function (req, res) {
  try {
    const { reference } = req.query;
    const id = req.params.id;

    const response = await PaystackService.verifyPayment(reference);

    if (response.data.status === "success") {
      let booking = await BookingService.get(id);

      booking.status = "current";
      booking.paymentStatus = "paid";

      let warehouse = await WarehouseService.get(booking.warehouse);

      const customerId = booking.customer;
      const ownerId = warehouse.owner;

      let customer = await UserService.get(customerId);
      let owner = await UserService.get(ownerId);
      let wallet = await WalletService.get(owner.wallet);

      wallet.balance = wallet.balance + response.data.amount / 100;

      // email to the owner
      const mailHtml = `<p> a warehouse user has made a payment of ${response.data.amount / 100
        } into your account with the reference code of ${response.data.reference
        } </p>`;
      const subject = `Payment for ${warehouse.facilityName}`;
      const email = owner.email;
      const option = {
        email,
        subject,
        mailHtml,
      };
      await nodemailer.send(option);

      // reduce the available spaces on the warehouse based on the info from the booking.
      warehouse.totalSpace = warehouse.totalSpace - booking.rentedSize;

      // notification to owner
      const notification1 = {
        title: `Payment received from ${customer.username}`,
        user: warehouse.owner,
        message: `You have received a NGN${response.data.amount / 100
          } payment for a space in ${warehouse.facilityName}`,
      };

      // notification to customer
      const notification2 = {
        title: `Payment made to ${owner.firstname} ${owner.lastname}`,
        user: customer.id,
        message: `You have made payment to ${owner.companyName}, for ${booking.rentedSize} square meters of space in ${warehouse.facilityName}`,
      };


      // create a notification using the notification service
      await NotificationService.create(notification1);
      await NotificationService.create(notification2);

      // create a transaction object
      const newTransaction = {
        booking_id: response.data.metadata._id,
        booking_status: response.data.metadata.status,
        start_date: response.data.metadata.startDate,
        end_date: response.data.metadata.endDate,
        warehouse: response.data.metadata.warehouse,
        warehouse_owners_name: `${owner.firstname} ${owner.lastname}`,
        warehouse_name: `${warehouse.facilityName}`,
        customer: response.data.metadata.customer,
        balance: wallet.balance,
        status: response.data.status,
        reference: response.data.reference,
        amount: response.data.amount / 100,
        currency: response.data.currency,
        spaceCost: response.data.metadata.spaceCost,
        warehouszitFee: response.data.metadata.transactionFee,
        totalCost: response.data.metadata.totalCost,
        paystackFee: response.data.fees / 100,
        rentedSpaceSize: response.data.metadata.rentedSize,
        customers_email: response.data.customer.email,
        customers_name: `${customer.firstname} ${customer.lastname}`,
        customer_code: response.data.customer.customer_code,
        payment_channel: response.data.channel,
        card_type: response.data.authorization.card_type,
        bank: response.data.authorization.bank,
      };

      const transaction = await TransactionService.create(newTransaction);

      wallet.transactions.push(transaction._id);

      booking.transactions.push(transaction._id);


      await BookingService.update(id, booking);
      await WalletService.update(wallet.id, wallet);
      await WarehouseService.update(warehouse.id, warehouse);
      await UserService.update(customer.id, customer);
      await UserService.update(owner.id, owner);

      // redirect to a payment success page
      return res.redirect(
        "https://warehouszit-client.vercel.app/seeker-dashboard/payment-success"
      );
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Payment unsuccessful",
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const dashboard = async function (req, res) {
  try {
    const spaceSeeker = req.user;
    const query = { customer: spaceSeeker.id };
    const bookings = await BookingService.getMany(query);

    if (bookings.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Dashboard data retrieved",
        data: {
          current_booking_number: 0,
          pending_booking_number: 0,
          canceled_booking_number: 0,
          completed_booking_number: 0,

          current_bookings: [],
          pending_bookings: [],
          canceled_bookings: [],
          completed_bookings: [],
        },
      });
    }

    let customer = {
      currentBookings: [],
      pendingBookings: [],
      canceledBookings: [],
      completedBookings: [],
    };

    bookings.forEach((booking) => {
      if (booking.status === "current") {
        customer.currentBookings.push(booking);
      } else if (booking.status === "pending") {
        customer.pendingBookings.push(booking);
      } else if (booking.status === "cancelled") {
        customer.canceledBookings.push(booking);
      } else if (booking.status === "completed") {
        customer.completedBookings.push(booking);
      }
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Dashboard data retrieved",
      data: {
        current_booking_number: customer.currentBookings.length,
        pending_booking_number: customer.pendingBookings.length,
        canceled_booking_number: customer.canceledBookings.length,
        completed_booking_number: customer.completedBookings.length,

        current_bookings: customer.currentBookings,
        pending_bookings: customer.pendingBookings,
        canceled_bookings: customer.canceledBookings,
        completed_bookings: customer.completedBookings,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const cronCancelled = async function () {
  try {
    console.log("cron job running the cronCancelled function");
    // get all the bookings that are pending
    const query = { status: "pending" };
    const bookings = await BookingService.getMany(query);

    // loop through the bookings and check if the it has been 24 hours since the booking was made
    bookings.forEach(async (booking) => {
      const date = new Date();
      const currentDate = date.getTime();
      const bookingDate = booking.createdAt.getTime();
      const difference = currentDate - bookingDate;
      const hours = Math.floor(difference / (1000 * 60 * 60));

      if (hours >= 24) {
        // cancel the booking
        booking.status = "cancelled";

        const warehouse = await WarehouseService.get(booking.warehouse);

        // create a notification
        const notification = {
          title: "Booking cancelled",
          user: booking.customer,
          message: `Your booking for ${warehouse.facilityName} has been cancelled`,
        };

        await BookingService.update(booking.id, booking);
        await NotificationService.create(notification);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};


const cronCompleted = async function () {
  try {
    console.log("cron job running the cronCompleted function");
    // get all the bookings that are current.
    const query = { status: "current" };
    const bookings = await BookingService.getMany(query);

    // loop through the bookings and check if the end date has passed
    bookings.forEach(async (booking) => {
      const date = new Date();
      const currentDate = date.getTime();
      const endDate = booking.endDate.getTime();

      if (currentDate > endDate) {
        // complete the booking
        booking.status = "completed";


        const warehouse = await WarehouseService.get(booking.warehouse);
        // increase the warehouse's total space rented
        warehouse.totalSpace += booking.rentedSize;

        // create a notification
        const notification = {
          title: "Booking completed",
          user: booking.customer,
          message: `Your booking for ${warehouse.facilityName} has been completed`,
        };

        await BookingService.update(booking.id, booking);
        await NotificationService.create(notification);
      }
    });

  } catch (error) {
    console.log(error.message);
  }
};


const cronForDisabledToggling = async function () {
  try {
    console.log("cron job running the cronForDisabledToggling function");

    const allDisabled = await DisabledService.getMany({});
    console.log(allDisabled);

    allDisabled.forEach(async (disabled) => {
      const date = new Date();
      const currentDate = date.getTime();
      const disabledDate = disabled.createdAt.getTime();
      const difference = currentDate - disabledDate;
      const hours = Math.floor(difference / (1000 * 60 * 60));

      console.log({
        date,
        currentDate,
        disabledDate,
        difference,
        hours
      });

      if (hours >= 24) {
        await DisabledService.delete(disabled.id);
        console.log("deleted");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const rateWarehouse = async function (req, res) {
  try {
    const warehouseId = req.params.id;
    const { rating } = req.body;
    const user = req.user;
    let warehouse = await WarehouseService.get(warehouseId);

    const query = { customer: user.id, warehouse: warehouseId, status: "completed" };
    const booking = await BookingService.getMany(query);

    if (booking.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "you have not completed a booking with this warehouse",
      });
    }

    warehouse.averageRating = (Number(warehouse.averageRating) + Number(rating)) / 2;
    warehouse.ratingCount = Number(warehouse.ratingCount) + 1;

    warehouse.averageRating = warehouse.averageRating.toFixed(1);

    const notification = {
      title: "Rating",
      user: warehouse.owner,
      message: `You have been rated ${rating} by ${user.firstname} ${user.lastname}`,
    };

    await NotificationService.create(notification);
    const ratedWarehouse = await WarehouseService.update(warehouseId, warehouse);
    await UserService.update(user.id, user);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Rating successful",
      ratedWarehouse
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchWarehouses,
  getWarehouse,
  calculate,
  reserveIt,
  cancelReservation,
  payNow,
  verifyPayment,
  dashboard,
  cronCancelled,
  cronCompleted,
  rateWarehouse,
  cronForDisabledToggling,
};
