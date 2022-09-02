var express = require('express');
var router = express.Router();

// Controller
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete } = require("./controller");

const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin);
/* GET home page. */
router.get('/', index);

// GET Category page
router.get('/create', viewCreate)
router.get('/edit/:id', viewEdit)

// POST Category page
router.post('/create', actionCreate)

// PUT Category page
router.put('/edit/:id', actionEdit)

// DELETE Category page
router.delete('/delete/:id', actionDelete)

module.exports = router;
