import { db } from "../db/db.js";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
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
    res.status(201).json({ 
      id: result.insertId, 
      username, 
      email, 
      first_name, 
      last_name, 
      phone, 
      status 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email or username already exists" });
    }
    res.status(500).json({ message: "Error creating user", error });
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
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      id: parseInt(id), 
      first_name, 
      last_name, 
      email, 
      phone, 
      status 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};