const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for users
const users = {};

// Register a new user (Create)
app.post("/users", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  if (users[username]) {
    return res.status(400).json({ error: "Username already exists." });
  }

  users[username] = { password };
  res.status(201).json({ message: "User registered successfully!" });
});

// Retrieve a user (Read)
app.get("/users/:username", (req, res) => {
  const { username } = req.params;

  if (!users[username]) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json({ username, password: users[username].password });
});

// Retrieve all users
app.get("/users", (req, res) => {
  const allUsers = Object.keys(users).map((username) => ({
    username,
    password: users[username].password,
  }));
  res.json(allUsers);
});

// Update user password (Update)
app.put("/users/:username", (req, res) => {
  const { username } = req.params;
  const { password } = req.body;

  if (!users[username]) {
    return res.status(404).json({ error: "User not found." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  users[username].password = password;
  res.json({ message: "Password updated successfully!" });
});

// Delete a user (Delete)
app.delete("/users/:username", (req, res) => {
  const { username } = req.params;

  if (!users[username]) {
    return res.status(404).json({ error: "User not found." });
  }

  delete users[username];
  res.json({ message: "User deleted successfully!" });
});

// Login (Authenticate)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  res.json({ message: "Login successful!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
