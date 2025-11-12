import express from "express";
import { loginUser, signupUser, forgotPassword, getUsers, getUserById, createUser, updateUser, deleteUser } from "../Controllers/user.controller.js";
import { getAllClinics, getClinicById, createClinic, updateClinic, deleteClinic, getClinicsByUserId } from "../Controllers/clinic.controller.js";

const router = express.Router();

// Test route
router.get("/", (req, res) => res.send("Server is running and Router is working"));

// Auth routes
router.post("/user/signup", signupUser); // User registration
router.post("/user/login", loginUser); // User login
router.post("/user/forgot-password", forgotPassword); // Password reset

// User routes
router.get("/users/", getUsers); // Get all users
router.get("/user/:id", getUserById); // Get user by ID
router.post("/user/create/", createUser); // Create new user
router.put("/user/update/:id", updateUser); // Update user by ID
router.delete("/user/delete/:id", deleteUser); // Delete user by ID

// Clinic routes
router.get("/clinics/", getAllClinics); // Get all clinics
router.get("/clinic/:id", getClinicById); // Get clinic by ID
router.get("/clinics/user/:userId", getClinicsByUserId); // Get clinics by user ID
router.post("/clinic/create/", createClinic); // Create new clinic
router.put("/clinic/update/:id", updateClinic); // Update clinic by ID
router.delete("/clinic/delete/:id", deleteClinic); // Delete clinic by ID

export { router };