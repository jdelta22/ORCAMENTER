import { useEffect, useState } from "react";
import api from "../../../services/api";

function MaterialModal({ isOpen, onClose, onSaved, material }) {
  const [description, setDescription] = useState("");
  const [unit_description, setUnitDescription] = useState("");
  const [unit_value, setUnitValue] = useState("");

  useEffect(() => {
    if (material) {
      // modo edição
      setDescription(material.description);
      setUnitDescription(material.unit_description);
      setUnitValue(material.unit_value);
    } else {
      // modo criação
      resetForm();
    }
  }, [material, isOpen]);

  function resetForm() {
    setDescription("");
    setUnitDescription("");
    setUnitValue("");
  }

  function handleSave() {
    const payload = {
      description,
      unit_description,
      unit_value,
    };

    const request = material
      ? api.put(`/materials/${material.id}/`, payload)
      : api.post("/materials/", payload);

    request
      .then((res) => {
        onSaved(res.data);
        resetForm();
      })
      .catch((err) => {
        alert("Erro ao salvar material");
      });
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{material ? "Editar Material" : "Novo Material"}</h2>

        <input
          placeholder="Material"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Unidade"
          value={unit_description}
          onChange={(e) => setUnitDescription(e.target.value)}
        />
        <input
          placeholder="Valor"
          value={unit_value}
          onChange={(e) => setUnitValue(e.target.value)}
        />

        <button onClick={handleSave}>
          {material ? "Salvar alterações" : "Criar material"}
        </button>

        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default MaterialModal;
