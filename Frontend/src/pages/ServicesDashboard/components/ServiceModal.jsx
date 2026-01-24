import { useEffect, useState } from "react";
import api from "../../../services/api";

function ServiceModal({ isOpen, onClose, onSaved, service }) {
  const [description, setDescription] = useState("");
  const [unit_description, setUnitDescription] = useState("");
  const [unit_value, setUnitValue] = useState("");

  useEffect(() => {
    if (service) {
      // modo edição
      setDescription(service.description);
      setUnitDescription(service.unit_description);
      setUnitValue(service.unit_value);
    } else {
      // modo criação
      resetForm();
    }
  }, [service, isOpen]);

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

    const request = service
      ? api.put(`/services/${service.id}/`, payload)
      : api.post("/services/", payload);

    request
      .then((res) => {
        onSaved(res.data);
        resetForm();
      })
      .catch((err) => {
        alert("Erro ao salvar service");
      });
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{service ? "Editar Service" : "Novo Service"}</h2>

        <input
          placeholder="Service"
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
          {service ? "Salvar alterações" : "Criar service"}
        </button>

        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default ServiceModal;
