const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;


const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();


// Import middlewares
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('./middlewares/customErrors');

// Middleware Setup
app.use(compression({ threshold: 0 }));
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Import API routes for login/register
const apiRoutes = require('./api/apiRoutes');
app.use('/api', apiRoutes);

// Cookie test routes
app.get('/api/set-cookie', (req, res) => {
  res.cookie('testCookie', 'HelloWorld', { httpOnly: true });
  res.json({ message: "Cookie has been set!" });
});

app.get('/api/get-cookie', (req, res) => {
  const cookieValue = req.cookies.testCookie;
  res.json({ message: "Cookie received!", cookie: cookieValue });
});

// Compression test
app.get('/api/test-compression', (req, res) => {
  res.json({ message: "This is a compressed response!" });
});

// CORS test
app.get('/api/test-cors', (req, res) => {
  console.log("CORS test route hit!");
  res.json({ message: "CORS is working!" });
});

// Render login page
app.get('/', (req, res) => {
  res.render('login');
});

// Home route (using cookie for username)
app.get('/api/home', (req, res) => {
  const username = req.cookies.username;
  res.render('home', { username });
});

// ✅ Render About page with team data
app.get('/api/about', (req, res) => {
  const aboutPath = path.join(__dirname, 'models/about.json');

  fs.readFile(aboutPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading about.json:', err);
      return res.status(500).send('Internal Server Error');
    }

    const team = JSON.parse(data);
    res.render('about', { team });
  });
});



// Render other EJS pages
app.get('/api/destinations', (req, res) => res.render('destinations'));
app.get('/api/register', (req, res) => res.render('register'));
app.get('/api/packages', (req, res) => res.render('packages'));
app.get('/api/gallery', (req, res) => res.render('gallery'));
app.get('/api/contact', (req, res) => res.render('contact'));
app.get('/api/book', (req, res) => res.render('book'));
app.get('/api/testimonials', (req, res) => res.render('testimonials'));

// Book a specific package by ID
app.get('/book/:id', (req, res) => {
  const packageId = req.params.id;
  const packagesPath = path.join(__dirname, 'models/packages.json');

  fs.readFile(packagesPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading packages data');
    }

    const packages = JSON.parse(data);
    const selectedPackage = packages.find(pkg => pkg.id == packageId);

    if (!selectedPackage) {
      return res.status(404).send('Package not found');
    }

    res.render('book', { package: selectedPackage });
  });
});

// Error test routes
app.get('/api/test-error', (req, res, next) => {
  throw new Error("This is a test error for middleware testing!");
});

app.get('/api/not-found', (req, res, next) => {
  next(new NotFoundError("The requested page does not exist!"));
});

app.get('/api/unauthorized', (req, res, next) => {
  next(new UnauthorizedError("You need to log in to access this resource!"));
});

app.get('/api/bad-request', (req, res, next) => {
  next(new BadRequestError("Invalid input data!"));
});

// Error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
