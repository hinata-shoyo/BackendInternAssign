import {
  login,
  signup,
  createEmployee,
  deleteEmployee,
  getEmployees,
  resetPassword,
} from "./../controllers/user.js";
import {
  getAllTasks,
  getTaskById,
  createTaskForEmployee,
  updateProgress,
  deleteTask,
  updateTask,
} from "../controllers/task.js";
import express from "express";
import { verifyToken } from "./../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.post("/login", login);
UserRouter.post("/signup", signup);
UserRouter.post("/createEmployee", verifyToken, createEmployee);
UserRouter.get("/getTaskById", verifyToken, getTaskById);
UserRouter.get("/getAllTasks", verifyToken, getAllTasks);
UserRouter.get("/getEmployees", verifyToken, getEmployees);
UserRouter.post("/createTaskForEmployee", verifyToken, createTaskForEmployee);
UserRouter.post("/deleteEmployee", verifyToken, deleteEmployee);
UserRouter.post("/updateProgress", verifyToken, updateProgress);
UserRouter.delete("/deleteTask", verifyToken, deleteTask);
UserRouter.post("/updateTask", verifyToken, updateTask);
UserRouter.post("/resetPassword", verifyToken, resetPassword);
export default UserRouter;
