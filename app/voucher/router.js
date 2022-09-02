const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();

// Controller
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete, actionStatus } = require("./controller");

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.get('/edit/:id', viewEdit);
router.put('/status/:id', actionStatus);
router.put('/edit/:id', multer({dest: os.tmpdir()}).single('image'), actionEdit);
router.post('/create', multer({dest: os.tmpdir()}).single('image'), actionCreate);
router.delete('/delete/:id', actionDelete);

module.exports = router;
