const express = require('express');
const path = require('path');
const UserController = require("../Controller/UserControl")
const { restrictToLoggedinUserOnly, checkAuth } = require("../Middleware/auth");

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../Views/HomePage.html"));
});

router.post('/SignUp', UserController.signup);
router.post('/Login', UserController.login);
router.get('/user/:email',restrictToLoggedinUserOnly, UserController.data);

module.exports = router;