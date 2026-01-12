import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OrcamentoDetail from "./pages/OrcamentoDetail";
import OrcamentoEdit from "./pages/OrcamentoEdit";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/orcamentos/detail/:id" element={<OrcamentoDetail />} />
        <Route path="/orcamentos/edit/:id" element={<OrcamentoEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
