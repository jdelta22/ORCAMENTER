import { useEffect, useState } from "react";
import api from "../../../services/api";
import ServiceModal from "./ServiceModal";

function ServiceSelect({ value, onChange }) {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/services/").then((res) => setServices(res.data));
  }, []);

  return (
    <>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione um Serviço</option>

        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.description} — {service.unit_description} —{" "}
            {service.unit_value}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => setShowModal(true)}>
        + Novo Serviço
      </button>

      <ServiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(service) => {
          setClients((prev) => [...prev, service]);
          onChange(service.id); // 🔑 seleciona automaticamente
        }}
      />
    </>
  );
}

export default ServiceSelect;
