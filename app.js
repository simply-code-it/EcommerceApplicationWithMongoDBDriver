const path = require("path");

const express = require("express");
const mongoConnect = require("./util/database").mongoConnect;

const bodyParser = require("body-parser");
const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// middleware to get user and use anywhere in the file
app.use((req, res, next) => {
  console.log("request body in app: ", req.body);
  User.findById("64affcee434db3d90bae9300")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
