const router  = require('express').Router();

const {
    add,
    getAll,
    getById,
    updateById,
    deleteById
} = require('../controllers/orders.controller');

router.post('/add', add);
router.get('/all', getAll);
router.get('/get_by_id/:id', getById);
router.put('/update_by_id/:id', updateById);
router.delete('/delete_by_id/:id', deleteById);


module.exports = router;