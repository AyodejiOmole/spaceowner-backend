const { Wallet } = require("../models");

class WalletService {
  static async createWallet(wallet) {
    try {
      const newWallet = await new Wallet(wallet).save();
      return newWallet;
    } catch (error) {
      throw new Error(`Error creating wallet: ${error.message}`);
    }
  }

  static async getWallet(id) {
    try {
      const wallet = await Wallet.findById(id);
      return wallet;
    } catch (error) {
      throw new Error(`Error getting wallet: ${error.message}`);
    }
  }

  static async updateWallet(id, data) {
    try {
      const updatedWallet = await Wallet.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedWallet;
    } catch (error) {
      throw new Error(`Error updating wallet: ${error.message}`);
    }
  }

  static async deleteWallet(id) {
    try {
      const deletedWallet = await Wallet.findByIdAndDelete(id);
      return deletedWallet;
    } catch (error) {
      throw new Error(`Error deleting wallet: ${error.message}`);
    }
  }
}
module.exports = WalletService;
