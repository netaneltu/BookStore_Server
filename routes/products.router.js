const router = require("express").Router();

// auth
const auth_manager = require("../middlewares/auth_manager");

// manager functions
const {
  getAllProductsForManager,
  addProductForManager,
  deleteProductForManager,
  getByIdForManager,
  updateProductForManager
} = require("../controllers/products.controller");


// customers functions
const {
  getAllProductsForCustomers,
  getProductByIdForCustomers,
  getByName
} = require("../controllers/products.controller");

// managers requests
router.get("/managers/all", /* auth_manager, */ getAllProductsForManager);
router.get("/managers/by_id/:product_id", /* auth_manager, */ getByIdForManager);
router.post(
  "/managers/add",
  /* auth_manager, */
  addProductForManager
);
router.put(
  "/managers/update/:product_id",
  /* auth_manager, */
  updateProductForManager
);
router.delete(
  "/managers/delete/:product_id",
  // auth_manager,
  deleteProductForManager
);

// _________________

// customer requests

router.get("/customers/all",getAllProductsForCustomers);
router.get("/customers/product/:product_id",getProductByIdForCustomers);
router.get("/customers/search",getByName);


// _________________

module.exports = router;
