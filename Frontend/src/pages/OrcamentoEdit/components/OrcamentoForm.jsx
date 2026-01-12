import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrcamentoForm({ children, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h1>Editar Orçamento</h1>
      {children}
      <button type="submit">Salvar</button>
    </form>
  );
}
export default OrcamentoForm;
