const path = require("path");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo")(session);
// all imports
dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);
connectDB();
const app = express();
//parsing
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// helpers
const { formatDate, truncate, stripTags, editIcon } = require("./helpers/hbs");
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
//session
app.use(
  session({
    secret: "thisissparta",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());
// global variables
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// static
app.use(express.static(path.join(__dirname, "public")));
// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/blogs", require("./routes/blogs"));

const port = process.env.PORT || 3000;
app.listen(
  port,
  console.log(`server is up on  ${process.env.NODE_ENV} mode on port ${port}`)
);
