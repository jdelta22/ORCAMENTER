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
  const isEdit = Boolean(id);

  const [orcamentoId, setOrcamentoId] = useState(id || null);
  const [orcamento, setOrcamento] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState("");

  const [serviceReloadKey, setServiceReloadKey] = useState(0);
  const [materialReloadKey, setMaterialReloadKey] = useState(0);

  function loadOrcamento(idToLoad = orcamentoId) {
    if (!idToLoad) return;

    api.get(`/orcaments/${idToLoad}/`).then((res) => {
      setOrcamento(res.data);
    });
  }
  useEffect(() => {
    if (id) {
      setOrcamentoId(id);
      loadOrcamento(id);
    }
  }, [id]);

  useEffect(() => {
    if (!orcamento) return;

    setForm({
      title: orcamento.title,
      description: orcamento.description,
    });

    setClientId(String(orcamento.client.id));
  }, [orcamento]);

  function handleSave(e) {
    e.preventDefault();

    // 🆕 CREATE
    if (!orcamentoId) {
      api
        .post("/orcaments/", {
          ...form,
          client: clientId,
          materials: [],
          services: [],
        })
        .then((res) => {
          console.log("RESPOSTA CREATE:", res.data);
          setOrcamentoId(res.data.id);
          navigate(`/orcamentos/edit/${res.data.id}`);
        });

      return;
    }

    // ✏️ UPDATE
    api
      .patch(`/orcaments/${orcamentoId}/`, {
        ...form,
        client: clientId,
      })
      .then(() => {
        loadOrcamento();
        navigate(`/orcamentos/detail/${orcamentoId}`);
      });
  }

  return (
    <div className="Container">
      <button type="button" onClick={() => navigate("/dashboard/")}>
        Voltar para orçamentos
      </button>
      <div className="editororcamento">
        <OrcamentoForm onSubmit={handleSave}>
          {/* BASE */}
          <div className="baseEdit">
            <OrcamentoBase form={form} setForm={setForm} />
            <ClientSelect value={clientId} onChange={setClientId} />
          </div>

          {/* MATERIAIS */}
          {orcamentoId && (
            <div className="materialEdit">
              <MaterialsEditor
                key={materialReloadKey}
                orcamentoId={orcamentoId}
                onChange={loadOrcamento}
              />

              <MaterialSelect
                onCreated={() => setMaterialReloadKey((prev) => prev + 1)}
              />
              <h3>Materiais adicionados</h3>

              {orcamento?.materials.map((mat) => (
                <div key={mat.id} className="row">
                  <span>{mat.material_detail.description}</span>
                  <span>Qtd: {mat.quantity}</span>
                  <span>Unit: R$ {mat.unit_value}</span>
                  <span>Total: R$ {mat.total_value}</span>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      api
                        .delete(`/orcament-materials/${mat.id}/`)
                        .then(() => loadOrcamento())
                    }
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SERVIÇOS */}
          {orcamentoId && (
            <div className="serviceEdit">
              <ServicesEditor
                key={serviceReloadKey}
                orcamentoId={orcamentoId}
                onChange={loadOrcamento}
              />

              <ServiceSelect
                onCreated={() => setServiceReloadKey((prev) => prev + 1)}
              />
              <h3>Serviços adicionados</h3>

              {orcamento?.services.map((ser) => (
                <div key={ser.id} className="row">
                  <span>{ser.service_detail.description}</span>
                  <span>Qtd: {ser.quantity}</span>
                  <span>Unit: R$ {ser.unit_value}</span>
                  <span>Total: R$ {ser.total_value}</span>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      api
                        .delete(`/orcament-services/${ser.id}/`)
                        .then(() => loadOrcamento())
                    }
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL */}
          {orcamento && <h2>Total do orçamento: R$ {orcamento.total_value}</h2>}
        </OrcamentoForm>
      </div>
    </div>
  );
}

export default OrcamentoEdit;
