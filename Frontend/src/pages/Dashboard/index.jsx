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
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="Container">
      <div className="dashboard">
        <h1>Meus Orçamentos</h1>
        <button onClick={() => navigate("/orcamentos/create")}>
          Novo Orçamento
        </button>
        {[...orcamentos]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((orc) => (
            <div key={orc.id} className="orcamento-card">
              <h3>{orc.title}</h3>
              <p>Cliente: {orc.client.name}</p>
              <p>Total: R$ {orc.total_value}</p>
              <button
                type="button"
                onClick={() => navigate(`/orcamentos/detail/${orc.id}`)}
              >
                Visualizar
              </button>
              <button
                type="button"
                onClick={() => navigate(`/orcamentos/edit/${orc.id}`)}
              >
                Edite
              </button>
              <button
                type="button"
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
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
