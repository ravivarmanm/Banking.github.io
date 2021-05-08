const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get("/", controller.home);
router.get("/customers", controller.viewAllCustomers);
router.get("/history", controller.getHistory);
router
  .route("/customers/:id/transfer")
  .get(controller.getTransactionPage)
  .post(controller.makeTransaction);

module.exports = router;
