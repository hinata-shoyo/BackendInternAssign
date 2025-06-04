import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();
const app = express();
import { Server } from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";
app.use(express.json());
app.use(cors());
import UserRouter from "./routes/UserRoutes.js";
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });
app.use("/", UserRouter);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
export const connectedUsers = new Map();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ mes: "hello" });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`serving on port ${process.env.PORT}`);
});
