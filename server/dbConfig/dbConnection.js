import mongoose from "mongoose";

// Function to establish connection with MongoDB
const dbConnection = async () => {
  try {
    // Connect to MongoDB using Mongoose
    const dbConnection = await mongoose.connect('mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority&appName=<appname>');

    console.log("DB Connected Successfully");
  } catch (error) {
    // Log error if connection fails
    console.log("DB Error: " + error);
  }
};

export default dbConnection;
