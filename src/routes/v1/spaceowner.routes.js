const express = require("express");
const router = express.Router();
const {spaceownerController} = require("../../controllers");

router.post("/warehouse",spaceownerController.createWarehouse);
router.get("/dashboard",spaceownerController.dashboard);
router.get("/warehouse",spaceownerController.getWarehouses);
router.get("/warehouse/:warehouseId",spaceownerController.getWarehouse);
router.put("/warehouse/:warehouseId/toggle-availability",spaceownerController.toggleAvailability);
router.delete("/warehouse/:warehouseId",spaceownerController.deleteWarehouse);
router.get("/transactions",spaceownerController.getTransactions);
router.get("/transaction/:transactionId",spaceownerController.getTransaction);
router.get("/card-details",spaceownerController.getCardDetails);
router.post("/card-details",spaceownerController.addCardDetails);
router.post("/withdrawal-request",spaceownerController.withdrawalRequest);
router.get("/withdrawal-request/:withdrawalId",spaceownerController.getWithdrawalRequest);

module.exports = router;