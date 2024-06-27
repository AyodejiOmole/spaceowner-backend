const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const routes = require("./routes");
const error404 = require("./errors/error404");
const passport = require("passport");
const docs = require("./config/docs");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { home } = require("./middlewares");
const session = require("express-session");
// const allowedOrigins = ['https://warehouzit.com', 'https://warehouszit-client.vercel.app/', 'http://localhost:3000/'];
// const allowedOrigins = ['https://warehouzit.com', 'https://warehouszit-client.vercel.app/', 'https://warehouzit.net'];
const allowedOrigins = ['https://warehouszit-client.vercel.app/', 'https://warehouzit.net'];


// log all requests
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);
app.use(morgan("tiny"));

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json({ limit: "100mb", extended: true }));
app.use(helmet());
app.use(cors(
  {
    // origin: "*",
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }
));
app.use(xss());

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 500000 })
);

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.get("/", home);
app.use("/api", routes);
app.get("/docs", docs);
app.use("*", error404);

module.exports = app;
