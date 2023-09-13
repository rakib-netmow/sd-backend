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

// --------> Local
// const corsOptions = {
//   origin: [
//     "*",
//     "https://xyz.in",
//     "https://xyz.netlify.app",
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "https://*.vercel.app",
//   ],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// ------> production

// const whitelist = "https://arifsclick.com/";
const corsOptions = {
  origin: (origin, callback) => {
    if (
      origin.includes("localhost:3000") ||
      origin.includes("http://localhost:3001")
    ) {
      callback(null, true);
    } else {
      const whitelist = "https://arifsclick.com/";
      const splitedOri = origin?.split("://");
      const splitedOri1 = splitedOri[1]?.split(".");
      // console.log(whitelist.includes(splitedOri1[1]));
      if (splitedOri1?.length === 2 && whitelist.includes(splitedOri1[0])) {
        callback(null, true);
      } else if (
        splitedOri1?.length === 3 &&
        whitelist.includes(splitedOri1[1])
      ) {
        callback(null, true);
      } else {
        callback(new Error());
      }
    }
  },
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());

// connect with database
connectDB();

// subdomain cors
// app.use(function (req, res, next) {
//   console.log("gg ", req.hostname);
//   if (req.hostname.endsWith("vercel.app")) {
//     res.setHeader("Access-Control-Allow-Origin", "http://" + req.hostname);
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "X-Requested-With,Content-Type"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, DELETE"
//     );
//   }
//   console.log("ghh ", req.headers);
//   next();
// });
// const router = express.Router();
// var whitelist = [
//   "https://squaddeck.vercel.app/",
//   "https://subdomain.example.com",
// ];
// router.all("*", (req, res, next) => {
//   var origin = req.headers.origin;
//   console.log(origin);
//   if (whitelist.indexOf(origin) != -1) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Headers", [
//     "Content-Type",
//     "X-Requested-With",
//     "X-HTTP-Method-Override",
//     "Accept",
//   ]);
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET,POST");
//   res.header("Cache-Control", "no-store,no-cache,must-revalidate");
//   res.header("Vary", "Origin");
//   if (req.method === "OPTIONS") {
//     res.status(200).send("");
//     return;
//   }
//   next();
// });

// folder structred
app.use("/public/api", publicRoutes);
app.use("/api", commonRoutes);
// app.use("/private/api", privateRoutes);
app.use("/secure/api", secureRoutes);

// base API
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
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
