import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import dbConnection from "./dbConfig/dbConnection.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import multer from "multer";
import path from "path";
import Jobs from "./models/jobsModel.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;

// MONGODB CONNECTION
dbConnection();

// Middleware
app.use(express.static("CVs"));
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan("dev"));

// Configuration for multer (File Upload)
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "CVs/");
  },
  filename: (req, file, cb) => {
    cb(null, req.query.userId ? `${req.query.userId}.pdf` : file.originalname);
  },
});
const cvUpload = multer({ storage: cvStorage });
app.post(`/upload-cv`, cvUpload.single("CV"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send("No File Provided");
      return;
    }
    res.status(200).send("CV uploaded successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

// Routes
app.use(router);

// Error Middleware
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
    cb(null, "./applicationresumes/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, req.query.fileName); // Use the original file name
  },
});

const fileUpload = multer({ storage: fileStorage });

app.post("/upload", fileUpload.single("file"), (req, res) => {
  const file = req.file; // Access the uploaded file
  // Process the file as needed
  res.json({ message: "File uploaded successfully." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
