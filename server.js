const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true 
}));
app.use(cookieParser());

const port = 7000;

app.use('/', require(path.join(__dirname, 'Routes/HomeRoutes.js')));

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
