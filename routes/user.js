const express = require('express');
const router = express.Router();
const { singUp } = require('../controller/user');

router.post('/signUp', singUp);

module.exports = router;
