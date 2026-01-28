import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import logo from "../../assets/logo.png";
import "./style.css";

export default function Sidebar() {
  const { open, toggleSidebar, closeSidebar } = useSidebar();
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  function go(path) {
    navigate(path);
    closeSidebar();
  }

  return (
    <aside className={`sidebar ${open ? "open" : "collapsed"}`}>
      {/* HEADER DA SIDEBAR */}
      <div className="sidebar-header">
        <img src={logo} className={open ? "logo" : "logo-collapsed"} />

        {/* BOTÃO DESKTOP */}
        <button className="collapse-btn" onClick={toggleSidebar}>
          {open ? "«" : "»"}
        </button>
      </div>

      <nav>
        <button onClick={() => go("/dashboard")}>
          <span className="icon">📊</span>
          <span className="label">Orçamentos</span>
        </button>
        <button onClick={() => go("/clients")}>
          <span className="icon">👤</span>{" "}
          <span className="label">Clientes</span>
        </button>
        <button onClick={() => go("/services")}>
          <span className="icon">🛠</span>{" "}
          <span className="label">Serviços</span>
        </button>
        <button onClick={() => go("/materials")}>
          <span className="icon">📦</span>{" "}
          <span className="label">Materiais</span>
        </button>
        <button className="logout" onClick={() => logout()}>
          <span className="icon">🚪</span> <span className="label">Sair</span>
        </button>
      </nav>
    </aside>
  );
}
