const { StatusCodes } = require("http-status-codes");
const {
  WarehouseService,
  NotificationService,
  UserProfileService,
  BookingService,
  PaystackService,
  WalletService,
  nodemailer,
} = require("../services");

const initializePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const user = await UserProfileService.getUserProfile(userId);
    const email = user.email;

    const booking = await BookingService.getBooking(bookingId);
    const amount = booking.totalCost;
    const bookingIdentity = booking.id;
    const callback_url = `https://warehouzitserver.onrender.com/api/v1/payment/verify/${bookingIdentity}`;

    const response = await PaystackService.initializePayment({
      amount,
      email,
      callback_url,
    });

    const adminNotification = {
      admin: true,
      title: "New Payment Initialized",
      message: `A new payment has been initialized by ${user.firstname} ${user.lastname}`,
    };

    const ownerNotification = {
      user: userId,
      title: "Payment Initialized",
      message: "Your payment has been initialized",
    };

    await NotificationService.create(adminNotification);
    await NotificationService.create(ownerNotification);


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

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await PaystackService.verifyPayment(reference);

    const id = req.params.id;

    if (response.data.status === "success") {
      let booking = await BookingService.getBooking(id);

      booking.status = "completed";
      booking.paymentStatus = "paid";

      let warehouse = await WarehouseService.getWarehouse(booking.warehouse);

      const customerId = booking.customer;
      const ownerId = warehouse.owner;

      let customer = await UserProfileService.getUserProfile(customerId);
      let owner = await UserProfileService.getUserProfile(ownerId);

      let wallet = await WalletService.getWallet(owner.wallet);

      wallet.balance = wallet.balance + response.data.amount / 100;

      // email to the owner
      const mailHtml = `<p> a warehouse user has made a payment of ${
        response.data.amount / 100
      } into your account with the reference code of ${
        response.data.reference
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
        user: warehouse.owner,
        message: `You have received a NGN${
          response.data.amount / 100
        } payment for a space in ${warehouse.facilityName}`,
      };

      // notification to customer
      const notification2 = {
        user: customer.id,
        message: `You have made payment to ${owner.companyName}, for a space in ${warehouse.facilityName}`,
      };

      // create a notification using the notification service
      await NotificationService.createNotification(notification1);
      await NotificationService.createNotification(notification2);

      wallet.transactions.push({
        type: "deposit",
        amount: Number(booking.totalCost),
        date: response.data.paidAt,
        transactionId: response.data.reference,
        description: `${response.data.gateway_response} ${response.data.message}`,
        accountName: response.data.customer.customer_code,
        accountNumber: response.data.customer.id,
      });

      await BookingService.updateBooking(id, booking);
      await WalletService.updateWallet(wallet.id, wallet);
      await WarehouseService.updateWarehouse(warehouse.id, warehouse);
      await UserProfileService.editUserProfile(customer.id, customer);
      await UserProfileService.editUserProfile(owner.id, owner);  

      // redirect to a payment success page
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Payment successful",
      });
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

module.exports = {
  initializePayment,
  verifyPayment,
};
