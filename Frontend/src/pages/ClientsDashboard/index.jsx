import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";
import { useNavigate } from "react-router-dom";

import ClientModal from "./components/ClientModal";

function Clients() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    api.get("/clients/").then((res) => setClients(res.data));
  }, []);

  function handleNew() {
    setSelectedClient(null);
    setShowModal(true);
  }

  function handleEdit(client) {
    setSelectedClient(client);
    setShowModal(true);
  }

  function handleSaved(client) {
    if (selectedClient) {
      // edição
      setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
    } else {
      // criação
      setClients((prev) => [...prev, client]);
    }

    setShowModal(false);
    setSelectedClient(null);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Meus Clientes</h1>
        <button onClick={handleNew}>Novo cliente</button>
      </div>

      <div className="card-container">
        {clients.map((client) => (
          <div className="client-card" key={client.id} value={client.id}>
            <h3>{client.name}</h3>
            <p>numero do documento: {client.document_number}</p>
            <p>tipo do documento: {client.document_type}</p>
            <p>Email: {client.email}</p>
            <p>Telefone: {client.phone}</p>

            <div className="client-buttons">
              <button onClick={() => handleEdit(client)}>Editar</button>
              <button
                type="button"
                onClick={() => {
                  api.delete(`/clients/${client.id}/`).then(() => {
                    setClients((prev) =>
                      prev.filter((c) => c.id !== client.id),
                    );
                  });
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}

        <ClientModal
          isOpen={showModal}
          client={selectedClient}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
          onSaved={handleSaved}
        />
      </div>
    </div>
  );
}

export default Clients;
