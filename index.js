const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

// internal export
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const publicRoutes = require("./routes/publicRoutes/index");
const commonRoutes = require("./routes/commonRoutes/index");
const privateRoutes = require("./routes/privateRoutes/index");
const secureRoutes = require("./routes/secureRoutes/index");

const app = express();

require("dotenv").config();
const corsOptions = {
  origin: [
    "https://xyz.in",
    "https://xyz.netlify.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://*.vercel.app",
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());

// connect with database
connectDB();

// subdomain cors
app.use(function (req, res, next) {
  console.log("gg ", req.hostname);
  if (req.hostname.endsWith("vercel.app")) {
    res.setHeader("Access-Control-Allow-Origin", "http://" + req.hostname);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
  }
  console.log("ghh ", req.headers);
  next();
});

// folder structred
app.use("/public/api", publicRoutes);
app.use("/api", commonRoutes);
// app.use("/private/api", privateRoutes);
app.use("/secure/api", secureRoutes);

// base API
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://*.vercel.app");
  res.header("Access-Control-Allow-Origin", "https://xyz.in");
  res.header("Access-Control-Allow-Origin", "https://xyz.netlify.app");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.send("Hello Squaddeck Development/Production !");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is runing at port ", port);
});
