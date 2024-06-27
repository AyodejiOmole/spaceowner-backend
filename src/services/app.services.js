class Services {
  constructor(Model) {
    this.Model = Model;
  }

  async create(data) {
    try {
      const model = new this.Model(data);
      return await model.save();
    } catch (error) {
      throw new Error(`Error creating ${this.Model}: ${error.message}`);
    }
  }

  async get(id) {
    try {
      return await this.Model.findById(id);
    } catch (error) {
      throw new Error(`Error getting ${this.Model} by id: ${error.message}`);
    }
  }

  async getMany(query = {}) {
    try {
      console.log(query);
      return await this.Model.find(query);
    } catch (error) {
      throw new Error(`Error getting many ${this.Model}: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      return await this.Model.findByIdAndUpdate(id, data, {
        new: true
      });
    } catch (error) {
      throw new Error(`Error updating ${this.Model}: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.Model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting ${this.Model}: ${error.message}`);
    }
  }

}

module.exports = Services;