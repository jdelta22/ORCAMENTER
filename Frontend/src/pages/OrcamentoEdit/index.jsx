import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrcamentoForm from "./components/OrcamentoForm";
import ClientSelect from "./components/ClientSelect";
import MaterialSelect from "./components/MaterialSelect";
import ServiceSelect from "./components/ServiceSelect";
import OrcamentoBase from "./components/OrcamentoBase";
import MaterialsEditor from "./MaterialEditor";
import api from "../../services/api";
import "./style.css";

function OrcamentoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState("");

  function loadOrcamento() {
    api.get(`/orcaments/${id}/`).then((res) => {
      setOrcamento(res.data);
    });
  }

  useEffect(() => {
    loadOrcamento();
  }, [id]);

  useEffect(() => {
    if (!orcamento) return;

    setForm({
      title: orcamento.title,
      description: orcamento.description,
    });

    setClientId(String(orcamento.client.id));
  }, [orcamento]);

  function handleSave() {
    api
      .patch(`/orcaments/${id}/`, {
        ...form,
        client: clientId,
      })
      .then(() => navigate(`/orcamentos/detail/${id}`));
  }

  return (
    <div className="editororcamneto">
      <OrcamentoForm onSubmit={handleSave}>
        <div className="baseEdit">
          <OrcamentoBase form={form} setForm={setForm} />
          <ClientSelect value={clientId} onChange={setClientId} />
        </div>
        <div className="materialEdit">
          <MaterialsEditor orcamentoId={id} onChange={loadOrcamento} />
          <h3>Materiais adicionados</h3>

          {orcamento?.materials.map((mat) => (
            <div key={mat.id} className="row">
              <span>{mat.material_detail.description}</span>
              <span>Qtd: {mat.quantity}</span>
              <span>Unit: R$ {mat.unit_value}</span>
              <span>Total: R$ {mat.total_value}</span>
            </div>
          ))}
        </div>
        <h2>Total do orçamento: R$ {orcamento?.total_value}</h2>
      </OrcamentoForm>
    </div>
  );
}
export default OrcamentoEdit;
