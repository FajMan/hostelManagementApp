import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import UserProvider from "./context/userContext.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" />
        <App />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
