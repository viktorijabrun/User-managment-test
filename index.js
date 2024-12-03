const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for users
const users = {};

// Register a new user
app.post("/register", (req, res) => {
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

// Retrieve password
app.get("/password/:username", (req, res) => {
  const { username } = req.params;

  if (!users[username]) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json({ password: users[username].password });
});

// Login
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
