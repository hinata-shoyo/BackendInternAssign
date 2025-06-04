import { connectedUsers } from "../index.js";
import { User, Task } from "./../db/model.js";

export const getAllTasks = async (req, res) => {
  if (req.user.user.role === "Manager") {
    const Employees = await User.find({ ManagerId: req.user.user._id });
    const tasks = await Task.find({
      assignedTo: { $in: Employees.map((Employee) => Employee._id) },
    }).populate("assignedTo", "name email");
    return res.json(tasks);
  }
};

export const createTaskForEmployee = async (req, res) => {
  if (req.user.user.role === "Manager") {
    const { title, description, id, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo: id,
      dueDate,
    });
    await task.save();
    const socketId = connectedUsers.get(id);
    if (socketId) {
      io.to(socketId).emit("taskAssigned", {
        message: `You have been assigned a new task: ${task.title}`,
      });
    }
    return res.status(200).json({ msg: "task created and assigned", task });
  }
};

export const deleteTask = async (req, res) => {
  if (req.user.user.role === "Manager") {
    const { id } = req.body;
    await Task.findOneAndDelete({ _id: id });
    return res.status(200).json({
      msg: "task deleted successfully",
    });
  }
};

export const updateTask = async (req, res) => {
  if (req.user.user.role === "Manager") {
    const { id, title, description, assignedTo, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        assignedTo,
        dueDate,
      },
    );
    return res.json({ msg: "updated", updated: task });
  }
};

//to get Employee specific tasks
export const getTaskById = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.user._id });
  return res.json({ tasks });
};

//to toggle the state of task (Completed or not)
export const updateProgress = async (req, res) => {
  const { id } = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ msg: "Task not found" });
  task.completed = !task.completed;
  await task.save();
  if (task.completed) {
    const socketId = connectedUsers.get(task.assignedTo);
    if (socketId) {
      io.to(socketId).emit("taskCompleted", {
        message: `Task "${task.title}" has been completed by ${task.assignedTo}`,
      });
    }
  }
  return res.json({ msg: "success", updated: task });
};
