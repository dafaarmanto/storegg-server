const express = require('express');
const router = express.Router();

// Controller
const { index, actionSignin, actionLogout } = require("./controller");

/* GET home page. */
router.get('/', index);
router.post('/', actionSignin);
router.get('/logout', actionLogout);

module.exports = router;
