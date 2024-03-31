import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { GoogleOAuthProvider } from '@react-oauth/google';

// FONTAWESOME SETUP
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Add the fab icons to the library
library.add(fab);
// FONTAWESOME SETUP END

// Rendering the React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Google OAuth Provider */}
    {/* Please replace the clientId value with your actual Google OAuth client ID */}
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
      {/* Redux Store Provider */}
      <Provider store={store}>
        {/* React Router BrowserRouter */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
