const express = require("express");
const router = express.Router();
const { warehouseController, spaceseekerControllerMain } = require("../../controllers");
const { jwtService } = require("../../services");
const { protect, spaceownerProtect, adminProtect } =
  jwtService;
const { multer } = require("../../middlewares");

router.get(
  "/number-listed",
  protect,
  spaceownerProtect,
  warehouseController.warehousesListed
);

router.get(
  "/listed",
  protect,
  spaceownerProtect,
  warehouseController.userListedWarehouses
);

router.get(
  "/engagements",
  protect,
  spaceownerProtect,
  warehouseController.warehouseEngagements
);

router.post(
  "/create",
  protect,
  spaceownerProtect,
  warehouseController.createWarehouse
);

router.post("/image/upload", multer, warehouseController.uploadMediaFile);
router.post("/pdf/upload", multer, warehouseController.uploadPdfFile);
router.get("/search", spaceseekerControllerMain.searchWarehouses);

router.get(
  "/verify/:id",
  protect,
  adminProtect,
  warehouseController.verifyWarehouse
);

router.get(
  "/active",
  protect,
  spaceownerProtect,
  warehouseController.activeWarehousesCount
);

router.put("/:id", protect, multer, warehouseController.updateWarehouse);


module.exports = router;