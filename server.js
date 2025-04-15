const express = require('express'); // Express for routing and middleware management
const path = require('path'); // Path to handle file paths
const helmet = require('helmet'); // Import Helmet for security
const morgan = require('morgan'); // Import Morgan for logging
const rateLimit = require('express-rate-limit'); // Import express-rate-limit
const compression = require('compression'); // Import compression middleware
const cors = require('cors'); // Import CORS
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware
const fs = require('fs');

const app = express();
const PORT = 8080;

// Import middlewares
const logger = require('./middlewares/logger'); // Import logger middleware
const errorHandler = require('./middlewares/errorHandler'); // Import error handler middleware
const { NotFoundError, UnauthorizedError, BadRequestError } = require('./middlewares/customErrors');

// Force Compression Middleware (Even for Small Responses)
app.use(compression({ threshold: 0 })); // Compress everything, even small responses
// Use Helmet for security best practices
// Test API Route for Compression
app.get('/api/test-compression', (req, res) => {
  res.json({ message: "This is a compressed response!" }); // Send a large response to test compression
});
app.use(helmet()); // Enables security headers
app.use(cookieParser()); // Enable cookie parsing
// Set a cookie
app.get('/api/set-cookie', (req, res) => {
  res.cookie('testCookie', 'HelloWorld', { httpOnly: true });
  res.json({ message: "Cookie has been set!" });
});

// Read the cookie
app.get('/api/get-cookie', (req, res) => {
  const cookieValue = req.cookies.testCookie;
  res.json({ message: "Cookie received!", cookie: cookieValue });
});

// Enable CORS (Allow requests from all origins)
app.use(cors());
app.get('/api/test-cors', (req, res) => {
  console.log("CORS test route hit!"); // Add this to debug
  res.json({ message: "CORS is working!" });
});

// Use Morgan for logging HTTP requests
app.use(morgan('dev')); // Logs HTTP requests in a concise format



// Rate limiting middleware - Limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter); // Apply rate limiting globally

// Middleware to handle JSON and URL-encoded data in POST requests
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// Use logger middleware for all incoming requests
app.use(logger); // Log each request

// Serve static files (HTML, CSS, JS) from the /public directory
//app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); // Set EJS as templating engine
app.set('views', path.join(__dirname, 'views')); // Optional if you're using /views

app.use(express.static(path.join(__dirname, 'public'))); // Keep this for CSS/images/JS



// Import API routes from apiRoutes.js
const apiRoutes = require('./api/apiRoutes'); // Import the API routes for login and register functionality
app.use('/api', apiRoutes); // Mount the API routes on /api path

// Serve login.html at the root URL
app.get('/', (req, res) => {
  res.render('login');
  //res.sendFile(path.join(__dirname, 'views', 'login.html')); // Serve the login page at root URL
});

// Example using Express route
app.get('/api/home', (req, res) => {
  const username = req.cookies.username; // Assuming it's stored in cookies
  res.render('home', { username });
});




 // res.sendFile(path.join(__dirname, 'views', 'home.html')); // Serve the dashboard HTML file


// Serve about.html when navigating to /api/about
app.get('/api/about', (req, res) => {
  res.render('about');

  //res.sendFile(path.join(__dirname, 'views', 'about.html')); // Serve the about page
});

// Serve destinations.html when navigating to /api/destinations
app.get('/api/destinations', (req, res) => {
  res.render('destinations');

  //res.sendFile(path.join(__dirname, 'views', 'destinations.html')); // Serve the destinations page
});

// Serve register.html when user needs to register
app.get('/api/register', (req, res) => {
  res.render('register');

  //res.sendFile(path.join(__dirname, 'views', 'register.html')); // Serve the register HTML file
});
// Serve destinations.html when navigating to /api/destinations
app.get('/api/packages', (req, res) => {
  res.render('packages');

  //res.sendFile(path.join(__dirname, 'views', 'packages.html')); // Serve the destinations page
});

// Serve gallery.html when navigating to /api/gallery
app.get('/api/gallery', (req, res) => {
  res.render('gallery');

  //res.sendFile(path.join(__dirname, 'views', 'gallery.html')); // Serve the destinations page
});

app.get('/api/contact', (req, res) => {
  res.render('contact');

  //res.sendFile(path.join(__dirname, 'views', 'contact.html')); // Serve the destinations page
});

// Serve book.html when navigating to /api/book
app.get('/api/book', (req, res) => {
  res.render('book');

  //res.sendFile(path.join(__dirname, 'views', 'book.html')); // Serve the Book Now page
});

// Serve testimonials.html when navigating to /api/testimonials
app.get('/api/testimonials', (req, res) => {
  res.render('testimonials');

  //res.sendFile(path.join(__dirname, 'views', 'testimonials.html')); // Serve the Testimonials page
});
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







// Test error route (Intentionally throws an error)
app.get('/api/test-error', (req, res, next) => {
  throw new Error("This is a test error for middleware testing!");
});

//Test 404 Not Found Error
app.get('/api/not-found', (req, res, next) => {
  next(new NotFoundError("The requested page does not exist!"));
});

// Test 401 Unauthorized Error
app.get('/api/unauthorized', (req, res, next) => {
  next(new UnauthorizedError("You need to log in to access this resource!"));
});

// Test 400 Bad Request Error
app.get('/api/bad-request', (req, res, next) => {
  next(new BadRequestError("Invalid input data!"));
});

// Handle undefined routes (404 Not Found)
//app.use((req, res, next) => {
//  next(new NotFoundError("This route does not exist!"));
//});

// Use error handler middleware for catching and handling errors
app.use(errorHandler); // Handle errors globally

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
