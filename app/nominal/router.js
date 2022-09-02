var express = require('express');
var router = express.Router();

// Controller
const { index, viewCreate, actionCreate, actionDelete, viewEdit, actionEdit } = require("./controller");

const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin);
/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionEdit);
router.post('/create', actionCreate);
router.delete('/delete/:id', actionDelete);

module.exports = router;
