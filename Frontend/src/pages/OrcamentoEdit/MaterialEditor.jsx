import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";

function MaterialsEditor({ orcamentoId, onChange }) {
  const [catalog, setCatalog] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitValue, setUnitValue] = useState("");

  // catálogo de materiais
  useEffect(() => {
    api.get("/materials/").then((res) => setCatalog(res.data));
  }, []);

  function addMaterial() {
    api
      .post("/orcament-materials/", {
        orcament: orcamentoId,
        material: materialId,
        quantity,
        unit_value: unitValue,
      })
      .then(() => {
        setMaterialId("");
        setQuantity("");
        setUnitValue("");

        onChange(); // 🔥 recarrega orçamento
      });
  }

  function removeMaterial(id) {
    api.delete(`/orcament-materials/${id}/`).then(() => {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    });
  }

  return (
    <>
      <h3>Adicionar material</h3>

      <select
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
      >
        <option value="">Material</option>
        {catalog.map((m) => (
          <option key={m.id} value={m.id}>
            {m.description} ({m.unit_description})
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

      <button type="button" onClick={addMaterial}>
        Adicionar
      </button>
    </>
  );
}

export default MaterialsEditor;
