import { useEffect, useState } from "react";
import api from "../../../services/api";
import MaterialModal from "./MaterialModal";

function MaterialSelect({ value, onChange }) {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/materials/").then((res) => setMaterials(res.data));
  }, []);

  return (
    <>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione um Material</option>

        {materials.map((material) => (
          <option key={material.id} value={material.id}>
            {material.description} — {material.unit_description} —{" "}
            {material.unit_value}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => setShowModal(true)}>
        + Novo Material
      </button>

      <MaterialModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(material) => {
          setClients((prev) => [...prev, material]);
          onChange(material.id); // 🔑 seleciona automaticamente
        }}
      />
    </>
  );
}

export default MaterialSelect;
