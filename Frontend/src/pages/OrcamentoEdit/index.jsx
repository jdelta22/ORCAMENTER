import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrcamentoForm from "./components/OrcamentoForm";
import ClientSelect from "./components/ClientSelect";
import MaterialSelect from "./components/MaterialSelect";
import ServiceSelect from "./components/ServiceSelect";
import OrcamentoBase from "./components/OrcamentoBase";
import MaterialsEditor from "./MaterialEditor";
import ServicesEditor from "./ServiceEditor";
import api from "../../services/api";
import "./style.css";

function OrcamentoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState("");
  const [serviceReloadKey, setServiceReloadKey] = useState(0);
  const [materialReloadKey, setMaterialReloadKey] = useState(0);

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

    setForm((prev) => ({
      title: prev.title || orcamento.title,
      description: prev.description || orcamento.description,
    }));

    setClientId((prev) => prev || String(orcamento.client.id));
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
          <MaterialsEditor
            key={materialReloadKey}
            orcamentoId={id}
            onChange={loadOrcamento}
          />
          <h3>Materiais adicionados:</h3>

          {orcamento?.materials.map((mat) => (
            <div key={mat.id} className="row">
              <span>{mat.material_detail.description}</span>
              <span>Qtd: {mat.quantity}</span>
              <span>Unit: R$ {mat.unit_value}</span>
              <span>Total: R$ {mat.total_value}</span>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  api
                    .delete(`/orcament-materials/${mat.id}/`)
                    .then(() => loadOrcamento());
                }}
              >
                🗑
              </button>
            </div>
          ))}
          <MaterialSelect
            onCreated={() => {
              setMaterialReloadKey((prev) => prev + 1);
            }}
          />
        </div>

        <div className="serviceEdit">
          <ServicesEditor
            key={serviceReloadKey}
            orcamentoId={id}
            onChange={loadOrcamento}
          />
          <h3>Serviços adicionados: </h3>

          {orcamento?.services.map((ser) => (
            <div key={ser.id} className="row">
              <span>{ser.service_detail.description}</span>
              <span>Qtd: {ser.quantity}</span>
              <span>Unit: R$ {ser.unit_value}</span>
              <span>Total: R$ {ser.total_value}</span>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  api
                    .delete(`/orcament-services/${ser.id}/`)
                    .then(() => loadOrcamento());
                }}
              >
                🗑
              </button>
            </div>
          ))}
          <ServiceSelect
            onCreated={() => {
              setServiceReloadKey((prev) => prev + 1);
            }}
          />
        </div>

        <h2>Total do orçamento: R$ {orcamento?.total_value}</h2>
      </OrcamentoForm>
    </div>
  );
}
export default OrcamentoEdit;
