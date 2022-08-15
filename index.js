const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const colors = require("colors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/users");
connectDB();
//middleware;
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
