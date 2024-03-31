import JWT from "jsonwebtoken";

// Middleware function for user authentication using JWT
const userAuth = async (req, res, next) => {
  // Extract the authorization header from the request
  const authHeader = req?.headers?.authorization;

  // Check if authorization header is missing or does not start with "Bearer"
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    // If authentication fails, call the next middleware with an error message
    next("Authentication failed");
  }

  // Extract the token from the authorization header
  const token = authHeader?.split(" ")[1];

  try {
    // Verify the token using JWT and the secret key stored in environment variables
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user information extracted from the token to the request body
    req.body.user = {
      userId: userToken.userId,
    };

    // Call the next middleware
    next();
  } catch (error) {
    // If an error occurs during token verification, log the error and call the next middleware with an error message
    console.log(error);
    next("Authentication failed");
  }
};

export default userAuth;
