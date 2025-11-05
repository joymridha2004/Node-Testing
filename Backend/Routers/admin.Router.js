import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../Controllers/admin.controller.js";

const routerAdmin = express.Router();

// Get all users
routerAdmin.get("/users/", getUsers);

// Get a single user by ID
routerAdmin.get("/user/:id", getUserById);

// Create a new user
routerAdmin.post("/create/", createUser);

// Update a user by ID
routerAdmin.put("/update/:id", updateUser);

// Delete a user by ID
routerAdmin.delete("/delete/:id", deleteUser);

export { routerAdmin };