const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bcrypt = require("bcrypt")
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

require("dotenv").config();

const authRuoter = require("./routes/api/auth")

const contactsRouter = require("./routes/api");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));



// const users = [];

// app.get("/api/users", (req, res) => {
//   res.json(users);
// })

// const avatarsDir = path.join(__dirname, "public", "books");

// app.post("/api/avatars", upload.single("imageAvatar"), async(req, res) => {
// const {path: tempUpload, originalname} = req.file;
// const resultUpload = path.join(avatarsDir, originalname);

// await fs.rename(tempUpload, resultUpload);
// const avatar = path.join("avatars", originalname);
// const newUser = {
//   id: nanoid(),
//   ...req.body,
//   avatar,
// };

// users.push(newUser);

// res.status(201).json(newUser)
// })

app.use("/api/auth", authRuoter)
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ 
    status: "Error",
    code: 404,
    message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    status: "Error",
    code: status,
    message: message,
  });
});



module.exports = app;
