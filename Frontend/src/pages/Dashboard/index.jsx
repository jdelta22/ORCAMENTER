import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [orcamentos, setOrcamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/orcaments/")
      .then((res) => setOrcamentos(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Meus Orçamentos</h1>
        <button onClick={() => navigate("/orcamentos/create")}>
          Novo Orçamento
        </button>
      </div>

      {[...orcamentos]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((orc) => (
          <div key={orc.id} className="orcamento-card">
            <h3>{orc.title}</h3>
            <p>Cliente: {orc.client.name}</p>
            <p>Total: R$ {orc.total_value}</p>

            <div className="buttons">
              <button onClick={() => navigate(`/orcamentos/detail/${orc.id}`)}>
                Visualizar
              </button>
              <button onClick={() => navigate(`/orcamentos/edit/${orc.id}`)}>
                Editar
              </button>
              <button
                onClick={() => {
                  api.delete(`/orcaments/${orc.id}/`).then(() => {
                    setOrcamentos((prev) =>
                      prev.filter((o) => o.id !== orc.id),
                    );
                  });
                }}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Dashboard;
