import { db } from "../db/db.js";
import bcrypt from "bcryptjs";

const formatResponse = (status, message, data = null, error = null, response_token = null) => {
  return {
    status: status ? 1 : 0,
    message,
    error,
    data,
    response_token
  };
};

// POST login API
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json(formatResponse(0, "Username and password are required"));
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json(formatResponse(0, "Invalid username or password"));
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json(formatResponse(0, "Invalid username or password"));
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(formatResponse(1, "Login successful", { user: userWithoutPassword }));
  } catch (error) {
    console.error(error);
    res.status(500).json(formatResponse(0, "Server error", null, error.message));
  }
};

// POST signup API
export const signupUser = async (req, res) => {
  const { username, email, password, first_name, last_name, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json(formatResponse(0, "Username, email, and password are required"));
  }

  try {
    // Check if username or email already exists
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json(formatResponse(0, "Username or email already exists"));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, first_name || null, last_name || null, phone || null]
    );

    res.status(201).json(formatResponse(1, "User registered successfully", { userId: result.insertId }));
  } catch (error) {
    console.error(error);
    res.status(500).json(formatResponse(0, "Server error", null, error.message));
  }
};

// POST forgot password
export const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json(formatResponse(0, "Email and new password are required"));
  }

  try {
    // Check if user exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json(formatResponse(0, "User with this email does not exist"));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await db.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [hashedPassword, email]
    );

    res.json(formatResponse(1, "Password updated successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(formatResponse(0, "Server error", null, error.message));
  }
};

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json(formatResponse(1, "Users fetched successfully", rows));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving users", null, error.message));
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json(formatResponse(0, "User not found"));
    }
    res.json(formatResponse(1, "User details fetched successfully", rows[0]));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving user", null, error.message));
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, phone, status } = req.body;

  // Generate username from first name and last name
  const username = `${first_name.toLowerCase()}.${last_name.toLowerCase()}`;

  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, email, first_name, last_name, phone, status, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, email, first_name, last_name, phone, status, 'temp_password'] // You should handle passwords properly
    );

    const userData = {
      id: result.insertId,
      username,
      email,
      first_name,
      last_name,
      phone,
      status
    };

    res.status(201).json(formatResponse(1, "User created successfully", userData));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json(formatResponse(0, "Email or username already exists"));
    }
    res.status(500).json(formatResponse(0, "Error creating user", null, error.message));
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, status } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ? WHERE id = ?",
      [first_name, last_name, email, phone, status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(0, "User not found"));
    }

    const userData = {
      id: parseInt(id),
      first_name,
      last_name,
      email,
      phone,
      status
    };

    res.json(formatResponse(1, "User updated successfully", userData));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json(formatResponse(0, "Email already exists"));
    }
    res.status(500).json(formatResponse(0, "Error updating user", null, error.message));
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(0, "User not found"));
    }
    res.json(formatResponse(1, "User deleted successfully"));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error deleting user", null, error.message));
  }
};