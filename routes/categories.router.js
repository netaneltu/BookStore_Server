const router = require("express").Router();
const auth_manager = require('../middlewares/auth_manager');


// managers functions 

const {

    getAllCategoriesForManagers,
    getAllSubCategoriesForManagers,
    getCategoryByIdForManagers,
    addNewCategoryForManagers,
    addNewSubCategoryForManagers,
    deleteCategoryByIdForManagers,
    deleteSubCategoryByIdForManagers,
    updateCategoryByIdForManagers,
    updateSubCategoryByIdForManagers

} = require ('../controllers/categories.controller');

// ___________________

// customers functions 

const {

    getAllCategoriesForCustomers,
    topProducts

} = require ('../controllers/categories.controller');

// ___________________




// managers requests


router.get('/managers/all',getAllCategoriesForManagers)
router.get('/managers/allsub',getAllSubCategoriesForManagers)
router.get('/managers/get-by-id/:id',getCategoryByIdForManagers)
router.post('/managers/add-category',addNewCategoryForManagers)
router.post('/managers/add-subcategory',addNewSubCategoryForManagers)
router.delete('/managers/delete-category/:id',deleteCategoryByIdForManagers)
router.delete('/managers/delete-subcategory/:id',deleteSubCategoryByIdForManagers)
router.put('/managers/update-category/:id',updateCategoryByIdForManagers)
router.put('/managers/update-subcategory/:id',updateSubCategoryByIdForManagers)


// __________________

// customers requests


router.get('/customers/all/',getAllCategoriesForCustomers);
router.get("/customers/products/top/:id",topProducts);



// __________________

module.exports = router;
