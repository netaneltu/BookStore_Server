var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const users_router = require("./routes/users.router");
const products_router = require("./routes/products.router");
const carts_router = require("./routes/carts.router");
const orders_router = require("./routes/orders.router");
const categories_router = require("./routes/categories.router");

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: '*',
    optionsSuccessStatus: 200,
  })
);

app.use("/users", users_router);
app.use("/products", products_router);
app.use("/carts", carts_router);
app.use("/orders", orders_router);
app.use("/categories", categories_router);

module.exports = app;
