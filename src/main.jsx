import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./routes/Home.jsx";
import Upload from "./routes/Upload.jsx";
import Resume from "./routes/Resume.jsx";
import Auth from "./routes/Auth.jsx";
import Wipe from "./routes/Wipe.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "upload", element: <Upload /> },
      { path: "resume/:id", element: <Resume /> },
      { path: "auth", element: <Auth /> },
      { path: "wipe", element: <Wipe /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
