import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../src/pages/Register";
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import Home from "../src/pages/Home";
import OrcamentoDetail from "../src/pages/OrcamentoDetail";
import OrcamentoEdit from "../src/pages/OrcamentoEdit";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardLayout from "../src/layouts/DashboardLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orcamentos/detail/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrcamentoDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orcamentos/edit/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrcamentoEdit />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orcamentos/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrcamentoEdit />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
