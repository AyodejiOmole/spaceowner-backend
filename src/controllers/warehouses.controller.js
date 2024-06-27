const { StatusCodes } = require("http-status-codes");
const { WarehouseService, NotificationService } = require("../services");
const { uploadMedia } = require("../config/cloudinary.config");

async function createWarehouse(req, res) {
  try {
    const { user } = req;
    if (!user.companyName || !user.NIN) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please complete your profile first",
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
    };

    // create a warehouse using the warehouse service
    const newWarehouse = await WarehouseService.createWarehouse(warehouse);

    if (!newWarehouse) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "warehouse not created",
      });
    }

    // create a notification for the user
    const notification = {
      user: req.user._id,
      message: `You have created a new warehouse: ${newWarehouse.facilityName}`,
    };

    // create a notification using the notification service
    await NotificationService.createNotification(notification);

    // return the response
    return res.status(StatusCodes.CREATED).json({
      message: "warehouse created successfully",
      newWarehouse,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function verifyWarehouse(req, res) {
  try {
    const warehouse = await WarehouseService.verifyWarehouse(req.params.id);

    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "warehouse not found",
      });
    }

    const notification = {
      user: warehouse.owner,
      message: `Your warehouse ${warehouse.title} has been verified!`,
    };
    await NotificationService.createNotification(notification);

    return res.status(StatusCodes.OK).json({
      message: "warehouse verification successful",
      warehouse,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateWarehouse(req, res) {
  try {
    // find the warehouse using the warehouse service
    const warehouse = await WarehouseService.getWarehouse(req.params.id);

    // build our a new warehouse object using if statements
    if (req.body.title) warehouse.title = req.body.title;
    if (req.body.description) warehouse.description = req.body.description;
    if (req.body.numberOfSpaces)
      warehouse.numberOfSpaces = req.body.numberOfSpaces;
    if (req.body.pricingPerUnit)
      warehouse.pricingPerUnit = req.body.pricingPerUnit;
    if (req.body.size) warehouse.size = req.body.size;
    if (req.body.humanCapacity)
      warehouse.humanCapacity = req.body.humanCapacity;
    if (req.body.SpecialInstructions)
      warehouse.SpecialInstructions = req.body.SpecialInstructions;
    if (req.body.featuresAndAmenities)
      warehouse.featuresAndAmenities = req.body.featuresAndAmenities;
    if (req.body.operatingHours)
      warehouse.operatingHours = req.body.operatingHours;
    if (req.body.operatingDays) {
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

      warehouse.operatingDays = days;
    }
    if (req.body.address) warehouse.address = req.body.address;
    if (req.body.state) warehouse.state = req.body.state;

    // update the warehouse using the warehouse service
    const updatedWarehouse = await WarehouseService.updateWarehouse(
      req.params.id,
      warehouse
    );

    if (!updatedWarehouse) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "warehouse not updated",
      });
    }

    // create a notification for the user
    const notification = {
      user: warehouse.owner,
      message: `You have updated your warehouse: ${updatedWarehouse.title}`,
    };

    // create a notification using the notification service
    await NotificationService.createNotification(notification);

    // return the response
    return res.status(StatusCodes.OK).json({
      message: "warehouse updated successfully",
      updatedWarehouse,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}
async function deleteWarehouse(req, res) {
  try {
    const warehouse = await WarehouseService.deleteWarehouse(req.params.id);

    if (!warehouse) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "warehouse not found",
      });
    }

    const notification = {
      user: warehouse.owner,
      message: `Your warehouse ${warehouse.title} has been deleted!`,
    };
    await NotificationService.createNotification(notification);

    return res.status(StatusCodes.OK).json({
      message: "warehouse deleted successfully",
      warehouse,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllUnverifiedWarehouses(req, res) {
  try {
    const warehouses = await WarehouseService.getAllUnverifiedWarehouses();
    if (!warehouses) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "no warehouse found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "warehouses retrieved successfully",
      warehouses,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllVerifiedWarehouses(req, res) {
  try {
    const warehouses = await WarehouseService.getAllVerifiedWarehouses();
    if (!warehouses) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "no warehouse found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "warehouses retrieved successfully",
      warehouses,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}



// uploadMedia functon
const uploadMediaFile = async (req, res) => {
  try {
    const files = [...(req.files.images || [])];
    console.log("files", files);
    const media = await Promise.all(files.map((file) => uploadMedia(file)));
    const Uploadedphotos = media.filter((file) => file.resource_type === "image");

    const photos = Uploadedphotos.map((photo) => ({
      public_id: photo.public_id,
      url: photo.secure_url,
    }));

    return res.status(StatusCodes.OK).json({
      photos,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// uploadPdfFile function
const uploadPdfFile = async (req, res) => {
  try {
    const files = [...(req.files.pdfs || [])];
    console.log("files", files);
    const media = await Promise.all(files.map((file) => uploadMedia(file)));

    const UploadedDocuments = media.filter(
      (file) => file.format === "pdf"
    );

    const documents = UploadedDocuments.map((document) => ({
      public_id: document.public_id,
      url: document.secure_url,
    }));

    return res.status(StatusCodes.OK).json({
      documents,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};



// create an async method for warehousesListed
async function warehousesListed(req, res) {
  try {
    const { id } = req.user;
    const warehouses = await WarehouseService.getUsersWarehouses(id);

    if (!warehouses) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "warehouses not found",
      });
    }

    const warehousesCount = warehouses.length;

    return res.status(StatusCodes.OK).json({
      message: "warehouses listed",
      warehousesCount,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

// create an async method for warehouseEngagements
async function warehouseEngagements(req, res) {
  try {
    const { id } = req.user;
    const warehouses = await WarehouseService.getUsersWarehouses(id);

    if (!warehouses) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "warehouses not found",
      });
    }

    const engagements = warehouses.reduce((acc, warehouse) => {
      return acc + warehouse.bookings.length;
    }, 0);

    return res.status(StatusCodes.OK).json({
      message: "warehouse engagements",
      engagements,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

// create an async method for activeWarehousesCount

async function activeWarehousesCount(req, res) {
  try {
    const { id } = req.user;
    const warehouses = await WarehouseService.getUsersWarehouses(id);

    if (!warehouses) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "warehouses not found",
      });
    }

    const activeWarehouses = warehouses.filter(
      (warehouse) => warehouse.isAvailable === true
    );

    const activeWarehousesCount = activeWarehouses.length;

    return res.status(StatusCodes.OK).json({
      message: "active warehouses count",
      activeWarehousesCount,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function userListedWarehouses(req, res) {
  try {
    const { id } = req.user;
    const warehouses = await WarehouseService.getUsersWarehouses(id);

    if (!warehouses) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "warehouses not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "user listed warehouses",
      warehouses,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createWarehouse,
  verifyWarehouse,
  getAllUnverifiedWarehouses,
  getAllVerifiedWarehouses,
  updateWarehouse,
  deleteWarehouse,
  uploadMediaFile,
  uploadPdfFile,
  warehousesListed,
  warehouseEngagements,
  activeWarehousesCount,
  userListedWarehouses,
};
