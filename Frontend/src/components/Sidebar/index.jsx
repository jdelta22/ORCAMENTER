import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="top">
        <button onClick={() => setOpen(!open)}>
          ☰{open && <h2>Orçamenter</h2>}
        </button>
      </div>

      <nav>
        <button onClick={() => navigate("/dashboard")}>
          📊 {open && "Dashboard"}
        </button>
        <button onClick={() => navigate("/clientes")}>
          👤 {open && "Clientes"}
        </button>

        <button onClick={() => navigate("/servicos")}>
          🛠 {open && "Serviços"}
        </button>

        <button onClick={() => navigate("/materiais")}>
          📦 {open && "Materiais"}
        </button>
      </nav>

      <div className="bottom">
        <button className="logout" onClick={logout}>
          🚪 {open && "Sair"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
