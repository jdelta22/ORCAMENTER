import { useEffect, useState } from "react";
import api from "../../../services/api";
import ServiceModal from "./ServiceModal";

function ServiceSelect({ onCreated }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        + Novo serviço
      </button>

      <ServiceModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={(service) => {
          onCreated?.(service); // opcional
          setOpen(false);
        }}
      />
    </>
  );
}

export default ServiceSelect;
