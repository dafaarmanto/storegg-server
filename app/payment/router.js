const express = require('express');
const router = express.Router();

// Controller
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionStatus, actionDelete } = require("./controller");

const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin);
/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.get('/edit/:id', viewEdit);
router.put('/status/:id', actionStatus);
router.put('/edit/:id', actionEdit);
router.post('/create', actionCreate);
router.delete('/delete/:id', actionDelete);

module.exports = router;
