require('dotenv').config();
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
let routes = require('./routes/routes');
const app = express();
const { connectDB } = require('./config/dbconnection');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


app.use(express.Router());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`server run on http://localhost:${PORT}`);
    connectDB();   // db connaction
});
