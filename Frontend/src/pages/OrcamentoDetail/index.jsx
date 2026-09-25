import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function OrcamentoDetail() {
  const [orcamento, setOrcamento] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    api
      .get(`/orcaments/${id}/`)
      .then((res) => setOrcamento(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!orcamento) return <p>Carregando...</p>;

  async function gerarPDF(id) {
    api
      .get(`/orcament/${id}/pdf/`, {
        responseType: "blob", // MUITO IMPORTANTE
      })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        window.open(fileURL);
      })
      .catch((err) => {
        console.error("Erro ao gerar PDF", err);
        alert("Erro ao gerar PDF");
      });
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Detalhes do Orçamento</h1>
        <button type="button" onClick={() => navigate("/dashboard/")}>
          Voltar
        </button>
      </div>

      {/* INFORMAÇÕES DO ORÇAMENTO */}
      <div className="section-card">
        <h3>Orçamento</h3>
        <p>
          <strong>Título:</strong> {orcamento.title}
        </p>
        <p>
          <strong>Descrição:</strong> {orcamento.description}
        </p>
        <p>
          <strong>Data:</strong> {orcamento.created_at}
        </p>
      </div>

      {/* CLIENTE */}
      <div className="section-card">
        <h3>Cliente</h3>
        <p>
          <strong>Nome:</strong> {orcamento.client.name}
        </p>
        <p>
          <strong>Documento:</strong> {orcamento.client.document_number}
        </p>
        <p>
          <strong>Tipo:</strong> {orcamento.client.document_type}
        </p>
        <p>
          <strong>Email:</strong> {orcamento.client.email}
        </p>
      </div>

      {/* MATERIAIS */}
      <div className="section-card">
        <h3>Materiais</h3>

        {orcamento.materials.map((mat) => (
          <div key={mat.id} className="row">
            <span>{mat.material_detail.description}</span>
            <span>Qtd: {mat.quantity}</span>
            <span>Unit: R$ {mat.unit_value}</span>
            <span>Total: R$ {mat.total_value}</span>
          </div>
        ))}
      </div>

      {/* SERVIÇOS */}
      <div className="section-card">
        <h3>Serviços</h3>

        {orcamento.services.map((serv) => (
          <div key={serv.id} className="row">
            <span>{serv.service_detail.description}</span>
            <span>{serv.unit_description}</span>
            <span>Qtd: {serv.quantity}</span>
            <span>Total: R$ {serv.total_value}</span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="total-card">
        Total do orçamento: <strong>R$ {orcamento.total_value}</strong>
      </div>
      <button
        type="button"
        onClick={() => gerarPDF(orcamento.id)}
        className="pdf-button"
      >
        Gerar PDF
      </button>
    </div>
  );
}
export default OrcamentoDetail;
