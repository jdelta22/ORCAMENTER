import { useState } from "react";
import api from "../../../services/api";

function MaterialModal({ isOpen, onClose, onCreated }) {
  const [description, setDescription] = useState("");
  const [unit_description, setUnit_description] = useState("");
  const [unit_value, setUnity_value] = useState("");

  function handleSave() {
    api
      .post("/materials/", {
        description,
        unit_description,
        unit_value,
      })
      .then((res) => {
        onCreated(res.data); // 🔑 comunica o pai
        onClose(); // 🔑 fecha modal

        // limpa form
        setDescription("");
        setUnit_description("");
        setUnity_value("");
      })
      .catch(console.error);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Novo Material</h2>

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Unidade de Medida"
          value={unit_description}
          onChange={(e) => setUnit_description(e.target.value)}
        />

        <input
          placeholder="Valor Unitario"
          value={unit_value}
          onChange={(e) => setUnity_value(e.target.value)}
        />

        <button type="button" onClick={handleSave}>
          Salvar
        </button>

        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default MaterialModal;
