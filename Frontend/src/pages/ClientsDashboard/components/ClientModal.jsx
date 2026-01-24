import { useEffect, useState } from "react";
import api from "../../../services/api";

function ClientModal({ isOpen, onClose, onSaved, client }) {
  const [name, setName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function onlyNumbers(value) {
    return value.replace(/\D/g, "");
  }

  function getDocumentType(value) {
    const digits = onlyNumbers(value);
    if (digits.length === 11) return "CPF";
    if (digits.length === 14) return "CNPJ";
    return "";
  }

  useEffect(() => {
    if (client) {
      // modo edição
      setName(client.name);
      setDocumentNumber(client.document_number);
      setDocumentType(client.document_type);
      setEmail(client.email);
      setPhone(client.phone);
    } else {
      // modo criação
      resetForm();
    }
  }, [client, isOpen]);

  function resetForm() {
    setName("");
    setDocumentNumber("");
    setDocumentType("");
    setEmail("");
    setPhone("");
  }

  function handleSave() {
    if (!documentType) {
      alert("CPF ou CNPJ inválido");
      return;
    }
    const payload = {
      name,
      document_number: onlyNumbers(documentNumber),
      document_type: documentType,
      email,
      phone,
    };

    const request = client
      ? api.put(`/clients/${client.id}/`, payload)
      : api.post("/clients/", payload);

    request
      .then((res) => {
        onSaved(res.data);
        resetForm();
      })
      .catch((err) => {
        const data = err.response?.data;

        if (data?.document_number) {
          alert("Já existe um cliente com esse CPF/CNPJ");
        } else {
          alert("Erro ao salvar cliente");
        }
      });
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{client ? "Editar Cliente" : "Novo Cliente"}</h2>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="CPF / CNPJ"
          value={documentNumber}
          onChange={(e) => {
            const value = e.target.value;
            setDocumentNumber(value);
            setDocumentType(getDocumentType(value));
          }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={handleSave}>
          {client ? "Salvar alterações" : "Criar cliente"}
        </button>

        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default ClientModal;
