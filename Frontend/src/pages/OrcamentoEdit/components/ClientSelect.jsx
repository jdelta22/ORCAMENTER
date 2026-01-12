import { useEffect, useState } from "react";
import api from "../../../services/api";
import ClientModal from "./ClientModal";

function ClientSelect({ value, onChange }) {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/clients/").then((res) => setClients(res.data));
  }, []);

  return (
    <>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione um cliente</option>

        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} — {client.document_number}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => setShowModal(true)}>
        + Novo Cliente
      </button>

      <ClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(client) => {
          setClients((prev) => [...prev, client]);
          onChange(client.id); // 🔑 seleciona automaticamente
        }}
      />
    </>
  );
}

export default ClientSelect;
