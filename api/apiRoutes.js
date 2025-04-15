const express = require('express') // Express for routing 
const path = require('path') // Path to handle file paths
const fs = require('fs') // FS module for reading and writing files
const router = express.Router() // Create an instance of Express Router

// Login route
router.post('/login', (req, res, next) => {
  const { username, password } = req.body // Destructure username and password from the request body
  // Read users data from the users.json file
  fs.readFile(path.join(__dirname, '../models/users.json'), 'utf-8', (err, data) => {
    if (err) return next(err) // Pass any error to the error handling middleware
    const users = JSON.parse(data) // Parse JSON data to get the user list
    const user = users.find(u => u.username === username && u.password === password) // Find matching user
    if (user) {
      res.cookie('username', user.username, { httpOnly: true }); // Set the cookie

      // If user exists, redirect to the dashboard
      return res.status(302).redirect('/api/home') // Redirect to dashboard.html
    } else {
      // If user doesn't exist, redirect to the register page
      return res.status(302).redirect('/api/register') // Redirect to register.html
    }
  })
})

// Register route
router.post('/register', (req, res, next) => {
  const { username, password } = req.body // Destructure username and password
  const newUser = { username, password } // Create a new user object
  // Read users data from the users.json file
  fs.readFile(path.join(__dirname, '../models/users.json'), 'utf-8', (err, data) => {
    if (err) return next(err) // Pass any error to the error handling middleware
    let users = []
    if (data) {
      users = JSON.parse(data) // Parse existing user data
    }
    users.push(newUser) // Add the new user to the users array
    // Write the updated users array back to the JSON file
    fs.writeFile(path.join(__dirname, '../models/users.json'), JSON.stringify(users, null, 2), (err) => {
      if (err) return next(err) // Pass any error to the error handling middleware
      res.status(302).redirect('/') // Redirect to login page after successful registration
    })
  })
})

router.post('/contact', (req, res, next) => {
  console.log("Contact form submitted:", req.body); // Debug log

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  fs.readFile(path.join(__dirname, '../models/contacts.json'), 'utf-8', (err, data) => {
    if (err && err.code !== 'ENOENT') return next(err);
    let contacts = [];
    if (data) {
      contacts = JSON.parse(data);
    }
    contacts.push({ name, email, message });

    fs.writeFile(path.join(__dirname, '../models/contacts.json'), JSON.stringify(contacts, null, 2), (err) => {
      if (err) return next(err);
      res.json({ success: true, message: "Message stored successfully!" });
    });
  });
});
// Route for packages
router.get('/packages', (req, res) => {
  const packagesPath = path.join(__dirname, '../models/packages.json');
  fs.readFile(packagesPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading packages data');
      return;
    }
    const packages = JSON.parse(data);
    res.render('packages', { packages });
  });
});

router.get('/book/:id', (req, res) => {
  const packageId = req.params.id;
  const packagesPath = path.join(__dirname, '../models/packages.json');
  fs.readFile(packagesPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading package data');
      return;
    }
    const packages = JSON.parse(data);
    const selectedPackage = packages.find(pkg => pkg.id == packageId);
    res.render('book', { package: selectedPackage });
  });
});

router.post('/book', (req, res) => {
  const { packageId, name, email } = req.body;
  // Process booking (e.g., store in database, send confirmation, etc.)
  res.send(`Booking confirmed for ${name} on package ID ${packageId}`);
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('username'); // Clear the login cookie
  res.redirect('/'); // Redirect to the login page
});

router.get('/home', (req, res) => {
  const filePath = path.join(__dirname, '..', 'models', 'home.json'); // correct relative path

  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      console.error('Failed to read home.json:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }

    try {
      const data = JSON.parse(jsonData);
      const username = req.cookies?.username || null;
      res.render('home', {
        username,
        about1: data.about1,
        about2: data.about2
      });
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return res.status(500).json({ error: 'JSON Parsing Error', message: parseError.message });
    }
  });
});








module.exports = router // Export the router so it can be used in server.js
