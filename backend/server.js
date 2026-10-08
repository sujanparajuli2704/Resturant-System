const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");
const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Restaurant Management API Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});