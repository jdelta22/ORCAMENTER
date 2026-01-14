import { useEffect, useState } from "react";
import api from "../../../services/api";
import MaterialModal from "./MaterialModal";

function MaterialSelect({ onCreated }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        + Novo Material
      </button>

      <MaterialModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={(material) => {
          onCreated?.(material); // opcional
          setOpen(false);
        }}
      />
    </>
  );
}

export default MaterialSelect;
