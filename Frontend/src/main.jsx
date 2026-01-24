import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Register from "./pages/Register";
import AppRoutes from "../routes/routes.jsx";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(<AppRoutes />);
