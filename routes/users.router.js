const router = require("express").Router();

//

const auth_user = require("../middlewares/auth_user");
const auth_manager = require("../middlewares/auth_manager");

//manager controller functions
const {
  loginManager,
  logoutManager,
  authManager,
  addManagerForAdmins,
} = require("../controllers/managers.controller");

//user controller functions

const {
  getAllCustomersForManager,
  getCustomerByIdForManager,
  deleteUserByIdForManager,
  updateUserByIdForManager,
  addUserForManager,
  login,
  authCustomer,
  logout,
  registerCustomer,
  updateCustomer,
  getById
} = require("../controllers/users.controller");

// admins request
router.post("/admins/add-manager", addManagerForAdmins);

// managers requests
router.post("/managers/login", loginManager);
router.post("/managers/logout", logoutManager);
router.get("/managers/auth", authManager);
router.post("/add-user-for-managers", addUserForManager);
router.get("/customers-for-managers", getAllCustomersForManager);
router.get("/customer-by-id-for-manager/:user_id", getCustomerByIdForManager);
router.delete("/delete-user-for-managers/:user_id", deleteUserByIdForManager);
router.put("/update-user-for-managers/:user_id", updateUserByIdForManager);

// customers requests
router.post("/customers/login", login);
router.post("/customers/logout", logout);
router.get("/customers/auth", authCustomer);
// router.get("/customers/refresh", refreshtoken);
router.post("/customers/register", registerCustomer);
router.put("/customers/update_by_id/:id", updateCustomer);
router.get("/customers/get_by_id/:id", getById);

module.exports = router;
