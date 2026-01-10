import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";

function Dashboard() {
  const [orcamentos, setOrcamentos] = useState([]);

  useEffect(() => {
    api
      .get("/orcaments/")
      .then((res) => setOrcamentos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Meus Orçamentos</h1>

      {orcamentos.map((orc) => (
        <div key={orc.id} className="card">
          <h3>{orc.title}</h3>
          <p>Cliente: {orc.client.name}</p>
          <p>Total: R$ {orc.total_value}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
