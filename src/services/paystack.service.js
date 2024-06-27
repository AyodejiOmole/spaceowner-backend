const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

class PaystackServices {
  static async initializePayment({ amount, email, callback_url, metadata }) {
    try {
      const response = await axios.post(
        `https://api.paystack.co/transaction/initialize`,
        {
          amount: amount * 100, //convert to kobo
          email: email,
          callback_url: callback_url,
          metadata: metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  static async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
}

module.exports = PaystackServices;
