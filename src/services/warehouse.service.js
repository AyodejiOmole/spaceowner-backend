const { Warehouse } = require("../models");

class WarehouseService {
  static async createWarehouse(warehouse) {
    try {
      const newWarehouse = await new Warehouse(warehouse).save();
      return newWarehouse;
    } catch (error) {
      throw new Error(`Error creating warehouse: ${error.message}`);
    }
  }

  static async verifyWarehouse(warehouseId) {
    try {
      const warehouse = await Warehouse.findByIdAndUpdate(
        warehouseId,
        { isVerified: true, isDeleted: false },
        { new: true }
      );
      return warehouse;
    } catch (error) {
      throw new Error(`Error verifying warehouse: ${error.message}`);
    }
  }

  static async getAllWarehouses() {
    try {
      const warehouses = await Warehouse.find({
        isDeleted: false,
      });
      return warehouses;
    } catch (error) {
      throw new Error(`Error getting warehouses: ${error.message}`);
    }
  }

  static async getUsersWarehouses(id) {
    try {
      const warehouses = await Warehouse.find({ owner: id, isDeleted: false });
      return warehouses;
    } catch (error) {
      throw new Error(`Error getting warehouses: ${error.message}`);
    }
  }

  static async getAllUnverifiedWarehouses() {
    try {
      const warehouses = await Warehouse.find({ isVerified: false, isDeleted: false });
      return warehouses;
    } catch (error) {
      throw new Error(`Error getting unverified warehouses: ${error.message}`);
    }
  }

  static async getAllVerifiedWarehouses() {
    try {
      const warehouses = await Warehouse.find({ isVerified: true, isDeleted: false });
      return warehouses;
    } catch (error) {
      throw new Error(`Error getting unverified warehouses: ${error.message}`);
    }
  }

  static async getWarehouse(warehouseId) {
    try {
      const warehouse = await Warehouse.findById(warehouseId);
      return warehouse;
    } catch (error) {
      throw new Error(`Error getting warehouse: ${error.message}`);
    }
  }

  static async updateWarehouse(warehouseId, warehouse) {
    try {
      const updatedWarehouse = await Warehouse.findByIdAndUpdate(
        warehouseId,
        warehouse,
        { new: true }
      );
      return updatedWarehouse;
    } catch (error) {
      throw new Error(`Error updating warehouse: ${error.message}`);
    }
  }

  static async deleteWarehouse(warehouseId) {
    try {
      const deletedWarehouse = await Warehouse.findByIdAndDelete(warehouseId);
      return deletedWarehouse;
    } catch (error) {
      throw new Error(`Error deleting warehouse: ${error.message}`);
    }
  }

  static async searchWarehouses(query) {
    try {
      // Create an empty array of search conditions
      const searchConditions = [];

      // Check if the query has a city property let the city property be case insensitive
      if (query.city) {
        searchConditions.push({ city: { $regex: query.city, $options: "i" } });
      }

      // Check if the query has a state property
      if (query.state) {
        searchConditions.push({
          state: { $regex: query.state, $options: "i" },
        });
      }

      // Check if the query has a size property
      if (query.size) {
        searchConditions.push({ size: { $regex: query.size, $options: "i" } });
      }

      // Check if the query has a pricingPerUnit property
      if (query.pricingPerUnit) {
        searchConditions.push({
          pricingPerUnit: { $regex: query.pricingPerUnit, $options: "i" },
        });
      }

      // Check if the query has a rating property
      if (query.rating) {
        searchConditions.push({
          rating: { $regex: query.rating, $options: "i" },
        });
      }



      // Perform the search
      const warehouses = await Warehouse.find({
        isVerified: true,
        $and: searchConditions,
      });

      
      return warehouses;
    } catch (error) {
      throw new Error(`Error searching warehouses: ${error.message}`);
    }
  }
}

module.exports = WarehouseService;
