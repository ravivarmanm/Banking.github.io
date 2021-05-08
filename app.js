const express = require("express");
const mongoose = require("mongoose");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");

const router = require("./router");

//configuring environment variables
dotenv.config();
//connecting to db
mongoose
  .connect(process.env.MONGOOSE_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection successful"))
  .catch((err) => console.error(err));

const app = express();
//session configuration

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
//flash configuration
app.use(flash());

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//configuring static files
app.use(express.static("public"));
//Configuration for rendering engine ejs
app.set("view engine", "ejs");
app.set("views", "./views");
//Security measures
app.use(mongoSanitize());
app.use(xss());
//Router mounting
app.use("/", router);
//Server listening at PORT
app.listen(process.env.PORT || 3000, () => {
  console.log(`App running at port ${process.env.PORT}`);
});
