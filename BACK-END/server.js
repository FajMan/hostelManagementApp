require("dotenv").config();
const connectDb = require("./config/db")
const errorHandler = require("./middleware/errormiddleware")
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const studentRoutes = require("./routes/studentRoutes");
const cookieParser = require("cookie-parser");

const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin")
    next()
})

app.use(cors({
    origin: [process.env.FRONTEND_URL, "https://hostel-management-app-qn1u.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
}))

app.use("/admin", adminRoutes);
app.use("/room", roomRoutes);
app.use("/student", studentRoutes);


app.get("/", (req, res) => console.log("Hello Teddy!"))

connectDb();

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Database Connected");

    app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
})