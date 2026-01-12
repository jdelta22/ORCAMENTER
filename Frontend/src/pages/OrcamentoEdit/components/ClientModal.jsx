import { useState } from "react";
import api from "../../../services/api";

function ClientModal({ isOpen, onClose, onCreated }) {
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

  function handleSave() {
    api
      .post("/clients/", {
        name,
        document_number: documentNumber,
        document_type: documentType,
        email,
        phone,
      })
      .then((res) => {
        onCreated(res.data); // 🔑 comunica o pai
        onClose(); // 🔑 fecha modal

        // limpa form
        setName("");
        setDocumentNumber("");
        setDocumentType("");
        setEmail("");
        setPhone("");
      })
      .catch(console.error);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Novo Cliente</h2>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="CPF/CNPJ"
          value={documentNumber}
          onChange={(e) => {
            const value = e.target.value;
            setDocumentNumber(value);
            setDocumentType(getDocumentType(value));
          }}
        />

        {documentType && <p>Tipo detectado: {documentType}</p>}

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

export default ClientModal;
