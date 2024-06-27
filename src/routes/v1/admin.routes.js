const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin.controller");
const spaceOwnerController = require("../../controllers/spaceowner.controller");

router.get("/dashboard", adminController.dashboard);
router.get("/transactions", adminController.getTransactions);
router.get("/transactions/:transactionId", adminController.getTransaction);
router.get("/withdrawal-request/:withdrawalId", adminController.getWithdrawalRequest);
router.get("/withdrawal-request/:withdrawalId/approve", adminController.approveTransaction);
router.post("/withdrawal-request/:withdrawalId/decline", adminController.declineTransaction);
router.get("/spaceowners", adminController.getSpaceOwners);
router.get("/spaceseekers", adminController.getSpaceSeekers);
router.get("/user/:userId", adminController.getUser);
router.get("/user/:userId/block", adminController.blockUser);
router.get("/user/:userId/unblock", adminController.unblockUser);
router.delete("/user/:userId", adminController.deleteUser);

router.get("/warehouses", adminController.getWarehouses);
router.get("/warehouse/:warehouseId", adminController.getWarehouse);
router.get("/warehouse/:warehouseId/approve", adminController.activateWarehouse);
router.put("/warehouse/:warehouseId/decline", adminController.declineWarehouse);
router.get("/warehouse/:warehouseId/block", adminController.blockWarehouse);
router.get("/warehouse/:warehouseId/unblock", adminController.unblockWarehouse);
router.delete("/warehouse/:warehouseId", adminController.deleteWarehouse);

router.get("/inquiries/export-csv", adminController.exportInquiriesToCsv);
router.get("/inquiries", adminController.getInquiries);
router.get("/inquiry/:inquiryId", adminController.getInquiry);
router.get("/inquiry/:inquiryId/resolve", adminController.resolveEnquiry);
router.put("/inquiry/:inquiryId/decline", adminController.declineEnquiry);
router.delete("/inquiry/:inquiryId", adminController.deleteEnquiry);

router.post("/warehouse", spaceOwnerController.createWarehouseAdmin);

module.exports = router;
