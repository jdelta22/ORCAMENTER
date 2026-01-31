import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";
import { useNavigate } from "react-router-dom";

import ServiceModal from "./components/ServiceModal";

function Services() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    api.get("/services/").then((res) => setServices(res.data));
  }, []);

  function handleNew() {
    setSelectedService(null);
    setShowModal(true);
  }

  function handleEdit(service) {
    setSelectedService(service);
    setShowModal(true);
  }

  function handleSaved(service) {
    if (selectedService) {
      // edição
      setServices((prev) =>
        prev.map((c) => (c.id === service.id ? service : c)),
      );
    } else {
      // criação
      setServices((prev) => [...prev, service]);
    }

    setShowModal(false);
    setSelectedService(null);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Meus Services</h1>
        <button onClick={handleNew}>Novo servicee</button>
      </div>

      <div className="card-container">
        {services.map((service) => (
          <div className="service-card" key={service.id} value={service.id}>
            <h3>Service: {service.description}</h3>
            <p>Unidade: {service.unit_description}</p>
            <p>Valor: {service.unit_value}</p>

            <div className="service-buttons">
              <button onClick={() => handleEdit(service)}>Editar</button>
              <button
                type="button"
                onClick={() => {
                  api.delete(`/services/${service.id}/`).then(() => {
                    setServices((prev) =>
                      prev.filter((c) => c.id !== service.id),
                    );
                  });
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ServiceModal
        isOpen={showModal}
        service={selectedService}
        onClose={() => {
          setShowModal(false);
          setSelectedService(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}

export default Services;
