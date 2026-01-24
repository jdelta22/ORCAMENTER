import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrcamentoForm({ onSubmit, children }) {
  const navigate = useNavigate();
  return (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit">Salvar</button>
    </form>
  );
}

export default OrcamentoForm;
