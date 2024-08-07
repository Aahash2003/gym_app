require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workout")
const caloriesRoutes = require("./routes/calorie")


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workout", workoutRoutes)
app.use("/api/calories", caloriesRoutes)

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));