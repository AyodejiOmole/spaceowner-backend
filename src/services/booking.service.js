const { Booking } = require("../models");

class BookingService {
 
  static async createBooking(data) {
    try {
      const newBooking = await Booking.create(data);
      return newBooking;
    } catch (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }

  static async getBooking(id) {
    try {
      const booking = await Booking.findById(id);
      return booking;
    } catch (error) {
      throw new Error(`Error getting booking: ${error.message}`);
    }
  }

  static async updateBooking(bookingID, data) {
    try {
      const updateBooking = await Booking.findByIdAndUpdate(
        bookingID,
        data,
        { new: true }
      ); 
      return updateBooking;
    } catch (error){
      throw new Error(`Error updating booking: ${error.message}`);
    }
  }
    
}

module.exports = BookingService;
