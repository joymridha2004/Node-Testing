import express from "express";
import { loginUser, signupUser, forgotPassword } from "../Controllers/user.controller.js";

const routerAuth = express.Router();

// Test route
routerAuth.get("/", (req, res) => res.send("Auth Router is working"));

// Auth routes
routerAuth.post("/signup", signupUser);
routerAuth.post("/login", loginUser);

// Forgot password
routerAuth.post("/forgot-password", forgotPassword);

export { routerAuth };
