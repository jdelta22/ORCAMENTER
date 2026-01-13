import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function OrcamentoDetail() {
  const [orcamento, setOrcamento] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    api
      .get(`/orcaments/${id}/`)
      .then((res) => setOrcamento(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!orcamento) return <p>Carregando...</p>;

  return (
    <div className="orcamento-detail-container">
      <div className="orcamento-information">
        <h1>Titulo: {orcamento.title}</h1>
        <p>Descrição: {orcamento.description}</p>
        <p>Data de confirmação: {orcamento.created_at}</p>
      </div>

      <div className="client-information">
        <h2>Cliente</h2>
        <p>Nome: {orcamento.client.name}</p>
        <p>Numero do documento: {orcamento.client.document_number}</p>
        <p>E-mail: {orcamento.client.email}</p>
      </div>

      <div className="material-information">
        <h2>Materiais</h2>
        {orcamento.materials.map((mat) => (
          <div key={mat.id}>
            <p>{mat.material_detail.description}</p>
            <p>Unidades = {mat.quantity}</p>
            <p>Valor unitario = R$ {mat.unit_value}</p>
            <p>R$ {mat.total_value}</p>
          </div>
        ))}
      </div>

      <div className="service-information">
        <h2>Serviços</h2>
        {orcamento.services.map((serv) => (
          <p key={serv.id}>
            {serv.service_detail.description} — R$ {serv.total_value}
          </p>
        ))}
      </div>

      <div className="orcamento-information">
        <h1>Total: R$ {orcamento.total_value}</h1>
      </div>
    </div>
  );
}
export default OrcamentoDetail;
