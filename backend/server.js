const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const recipeRoutes = require("./routes/recipes");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const adminRoutes = require("./routes/admin");
const cookieParser = require("cookie-parser");
const AuthMiddleware = require("./middlewares/AuthMiddleware");
const cron = require("node-cron");

const sendEmail = require("./helpers/sendEmail");
const AdminMiddleware = require("./middlewares/AdminMiddleware");
const url =
  "mongodb+srv://kyawkhainglynn023:kyaw201218@cluster0.jsbq5tk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => {
    console.log("db is connected");
    app.listen(process.env.PORT, (req, res) => {
      console.log("app is running on localhost : " + process.env.PORT);
      cron.schedule("* * * * *", () => {
        console.log("running a task every minute");
      });
    });
  })
  .catch((e) => {
    console.log(e);
  });

const app = express();
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  return res.render("email");
});

app.use("/api/recipes", AuthMiddleware, recipeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", AuthMiddleware, commentsRoutes);
app.use("/api/admin",AuthMiddleware, AdminMiddleware, adminRoutes);
app.get("/send-email", async (req, res) => {
  try {
    await sendEmail({
      path: "test",
      data: {
        name: "aung aung",
      },
      from: "KyawKhaingLynn@gmail.com",
      to: "hninnuyee@gmail.com",
      subject: "arr bwar a thel",
    });
    return res.send("email already sent");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
