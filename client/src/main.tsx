import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { AccountProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AccountProvider>
      <Toaster position="top-right"/>
        <App />
    </AccountProvider>
  </React.StrictMode>
);
