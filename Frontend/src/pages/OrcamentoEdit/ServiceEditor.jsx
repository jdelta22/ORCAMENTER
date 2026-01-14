import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";

function ServicesEditor({ orcamentoId, onChange }) {
  const [catalog, setCatalog] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitValue, setUnitValue] = useState("");

  // catálogo de materiais
  useEffect(() => {
    api.get("/services/").then((res) => setCatalog(res.data));
  }, []);

  function addService() {
    api
      .post("/orcament-services/", {
        orcament: orcamentoId,
        service: serviceId,
        quantity,
        unit_value: unitValue,
      })
      .then(() => {
        setServiceId("");
        setQuantity("");
        setUnitValue("");

        onChange(); // 🔥 recarrega orçamento
      });
  }

  function removeService(id) {
    api.delete(`/orcament-services/${id}/`).then(() => {
      setMaterials((prev) => prev.filter((s) => s.id !== id));
    });
  }

  return (
    <>
      <h3>Adicionar Serviço</h3>

      <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
        <option value="">Serviço</option>
        {catalog.map((s) => (
          <option key={s.id} value={s.id}>
            {s.description} ({s.unit_description})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantidade"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor unitário"
        value={unitValue}
        onChange={(e) => setUnitValue(e.target.value)}
      />

      <button type="button" onClick={addService}>
        Adicionar
      </button>
    </>
  );
}

export default ServicesEditor;
