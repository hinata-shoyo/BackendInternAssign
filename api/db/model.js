import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completed: {
    type: Boolean,
    default: "false",
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Manager", "Employee"], default: "Employee" },
  ManagerId: { type: String, ref: "User", default: null },
});

export const Task = mongoose.model("Task", taskSchema);
export const User = mongoose.model("User", userSchema);
