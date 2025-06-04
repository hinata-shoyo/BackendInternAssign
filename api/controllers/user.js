import { User } from "./../db/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (!name || !email || !password) {
    return res.status(403).json({ msg: "require credentials" });
  }
  if (user) {
    return res.status(400).json({ msg: "user already exists" });
  }
  const encPassword = await bcrypt.hash(password, 10);
  const Manager = new User({
    name: name,
    email: email,
    password: encPassword,
    role: "Manager",
  });
  await Manager.save();
  const token = jwt.sign({ user: Manager }, process.env.JWT);
  return res
    .status(200)
    .json({ msg: "Manager created successfully", Manager, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "user doesn't exist" });
  }
  try {
    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return res.status(401).json({ msg: "wrong password" });
    }
    const token = jwt.sign({ user }, process.env.JWT);
    return res.status(200).json({ msg: "success", user, token });
  } catch (error) {
    return res.status(401).json({ msg: error });
  }
};

export const createEmployee = async (req, res) => {
  const { name, email } = req.body;
  if (req.user.user.role == "Manager") {
    const existingMember = await User.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ msg: "Employee already exists" });
    }
    const tempPassword = "password";
    const hashPassword = await bcrypt.hash(tempPassword, 10);
    const Employee = new User({
      name: name,
      email: email,
      password: hashPassword,
      role: "Employee",
      ManagerId: req.user.user._id,
    });
    await Employee.save();
    return res.status(200).json({
      msg: "Employee created successfully",
      member: { name, email, password: tempPassword },
    });
  }
};

export const deleteEmployee = async (req, res) => {
  if (req.user.user.role === "Manager") {
    const { id } = req.body;
    await User.deleteOne({ _id: id, ManagerId: req.user.user._id });
    return res.status(200).json({
      msg: "Employee deleted successfully",
    });
  }
};

export const getEmployees = async (req, res) => {
  if (req.user.user.role === "Manager") {
    const Employees = await User.find({ ManagerId: req.user.user._id });
    return res.status(200).json({ Employees });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const newPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { _id: req.user.user._id },
    {
      password: newPassword,
    },
  );
  if (user) return res.status(200).json({ msg: "password updated" });
  return res.json({ msg: "some error occured" });
};
