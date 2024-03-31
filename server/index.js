// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// Import database connection function, routes, error middleware, and other dependencies
import dbConnection from "./dbConfig/dbConnection.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import multer from "multer";
import path from "path";
import Jobs from "./models/jobsModel.js";

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Set port
const PORT = process.env.PORT || 8800;

// Connect to MongoDB
dbConnection();

// Middleware setup
app.use(express.static("CVs")); // Serve static files from the "CVs" directory
app.use(cors()); // Enable CORS
app.use(xss()); // Prevent XSS attacks
app.use(mongoSanitize()); // Sanitize data against NoSQL Injection attacks
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json({ limit: "10mb" })); // Set JSON body limit to 10mb
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies with extended mode
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parse JSON bodies with extended mode and limit of 30mb
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Parse URL-encoded bodies with extended mode and limit of 30mb
app.use(morgan("dev")); // Logging HTTP requests in dev mode

// Configuration for multer (File Upload)
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "CVs/"); // Destination directory for uploaded CVs
  },
  filename: (req, file, cb) => {
    // Filename logic - if userId provided, use userId.pdf, otherwise use original filename
    cb(null, req.query.userId ? `${req.query.userId}.pdf` : file.originalname);
  },
});
const cvUpload = multer({ storage: cvStorage });
app.post(`/upload-cv`, cvUpload.single("CV"), async (req, res) => {
  // Handle CV upload
  console.log(req.file); // Log uploaded file details
  try {
    if (!req.file) {
      // If no file provided, send 400 status with error message
      res.status(400).send("No File Provided");
      return;
    }
    // Send success response if CV uploaded successfully
    res.status(200).send("CV uploaded successfully");
  } catch (error) {
    // Send error response if any error occurs during upload
    res.status(400).send(error);
  }
});

// Routes setup
app.use(router);

// Error middleware
app.use(errorMiddleware);

// Static resource serving
const __dirname = path.resolve();
app.use(
  "/resources",
  express.static(path.join(__dirname, "applicationresumes"))
);

// Configuration for another file upload
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./applicationresumes/"); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, req.query.fileName); // Use the original file name provided in query parameters
  },
});

const fileUpload = multer({ storage: fileStorage });

app.post("/upload", fileUpload.single("file"), (req, res) => {
  // Handle file upload
  const file = req.file; // Access the uploaded file
  // Process the file as needed
  res.json({ message: "File uploaded successfully." }); // Send success response
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
