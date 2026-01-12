import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrcamentoForm from "./components/OrcamentoForm";
import ClientSelect from "./components/ClientSelect";
import api from "../../services/api";
import "./style.css";

function OrcamentoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState(null);

  function handleSave() {
    api
      .patch(`/orcaments/${id}/`, { ...form, client: clientId })
      .then(() => navigate(`/orcamentos/detail/${id}`));
  }

  return (
    <OrcamentoForm onSubmit={handleSave}>
      <ClientSelect value={clientId} onChange={setClientId} />
    </OrcamentoForm>
  );
}
export default OrcamentoEdit;
