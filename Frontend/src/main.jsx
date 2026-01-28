import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import AppRoutes from "../routes/routes.jsx";
import ReactDOM from "react-dom/client";
import { SidebarProvider } from "./context/SidebarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <AppRoutes />
  </SidebarProvider>,
);
