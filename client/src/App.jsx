// Importing necessary modules and components
import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  UploadJob,
  UserProfile,
} from "./pages";
import { useSelector } from "react-redux";
import JobNews from "./pages/JobNews";
import Apply from "./pages/Apply";
import { SkeletonTheme } from "react-loading-skeleton";
import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import FindFreeJobs from "./pages/FindFreeJobs";
import JobDetailFree from "./pages/JobDetailFree";
import NotFound from "./pages/NotFound";

// Function to handle layout based on user authentication
function Layout() {
  // Retrieve user information from Redux store
  const { user } = useSelector((state) => state.user);
  // Get current location using React Router's useLocation hook
  const location = useLocation();

  return user?.token ? ( // Check if user is authenticated
    // If authenticated, render nested routes
    <Outlet />
  ) : (
    // If not authenticated, render specific route
    <Routes>
      {/* Render FindFreeJobs component for home when user is not present */}
      <Route
        path="/"
        element={<FindFreeJobs />}
      />
      {/* 
          Uncomment the below line to enable redirection to user authentication page
          <Navigate to="/user-auth" state={{ from: location }} replace />
      */}
    </Routes>
  );
}

// Main application component
function App() {
  // Retrieve user information from Redux store
  const { user } = useSelector((state) => state.user);
  // State to manage theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Function to toggle theme
  const toggleTheme = (theme) => {
    setTheme(theme);
  };

  return (
    // Main container with theme management
    <main
      className={`${
        theme === "dark" ? "dark" : ""
      } bg-[#f7fdfd] dark:bg-slate-800`}
    >
      {/* Skeleton theme provider for loading skeleton */}
      <SkeletonTheme baseColor="#e6e6e6" highlightColor="#b8b8b8">
        {/* Navigation bar */}
        <Navbar toggleTheme={toggleTheme} />

        {/* Router configuration */}
        <Routes>
          {/* Layout component containing nested routes */}
          <Route element={<Layout />}>
            {/* Nested routes */}
            {/* Redirect to find-jobs page if user hits root */}
            <Route
              path="/"
              element={<Navigate to="/find-jobs" replace={true} />}
            />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/companies" element={<Companies />} />
            {/* Render user profile based on account type */}
            <Route
              path={
                user?.accountType === "seeker"
                  ? "/user-profile"
                  : "/user-profile"
              }
              element={<UserProfile />}
            />
            <Route path={"/company-profile"} element={<CompanyProfile />} />
            <Route path={"/company-profile/:id"} element={<CompanyProfile />} />
            <Route path={"/upload-job"} element={<UploadJob />} />
            <Route path={"/applications"} element={<Applications />} />
            <Route path={"/job-news"} element={<JobNews />} />
            <Route path={"/job-detail/:id"} element={<JobDetail />} />
            <Route path={"/apply/:id"} element={<Apply />} />
          </Route>
          {/* Route for free job detail */}
          <Route
            path="/jobs-detail/:id"
            element={<JobDetailFree />}
          />
          <Route path="/about-us" element={<About />} />
          <Route path="/user-auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Scroll to top button */}
        <ScrollToTop />
        {/* Footer component */}
        {user && <Footer />}
      </SkeletonTheme>
    </main>
  );
}

// Exporting App component as default
export default App;
