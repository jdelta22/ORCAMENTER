import { useState } from "react";
import api from "../../../services/api";

function MaterialModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    description: "",
    unit_description: "",
    unit_value: "",
  });
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    api
      .post("/materials/", form)
      .then((res) => {
        onCreated(res.data); // 🔑 comunica o pai
        setForm({ description: "", unit_description: "", unit_value: "" });
      })
      .catch(console.error);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Novo Material</h2>

        <input
          type="text"
          name="description"
          placeholder="Material"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="unit_description"
          placeholder="Unidade de Medida"
          value={form.unit_description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="unit_value"
          placeholder="Valor Unitário"
          value={form.unit_value}
          onChange={handleChange}
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
