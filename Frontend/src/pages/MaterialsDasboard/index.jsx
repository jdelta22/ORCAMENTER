import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";
import { useNavigate } from "react-router-dom";

import MaterialModal from "./components/MaterialModal";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    api.get("/materials/").then((res) => setMaterials(res.data));
  }, []);

  function handleNew() {
    setSelectedMaterial(null);
    setShowModal(true);
  }

  function handleEdit(material) {
    setSelectedMaterial(material);
    setShowModal(true);
  }

  function handleSaved(material) {
    if (selectedMaterial) {
      // edição
      setMaterials((prev) =>
        prev.map((c) => (c.id === material.id ? material : c)),
      );
    } else {
      // criação
      setMaterials((prev) => [...prev, material]);
    }

    setShowModal(false);
    setSelectedMaterial(null);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Meus Materials</h1>
        <button onClick={handleNew}>Novo material</button>
      </div>

      <div className="card-container">
        {materials.map((material) => (
          <div className="material-card" key={material.id} value={material.id}>
            <h3>Material: {material.description}</h3>
            <p>Unidade: {material.unit_description}</p>
            <p>Valor: {material.unit_value}</p>

            <div className="material-buttons">
              <button onClick={() => handleEdit(material)}>Editar</button>
              <button
                type="button"
                onClick={() => {
                  api.delete(`/materials/${material.id}/`).then(() => {
                    setMaterials((prev) =>
                      prev.filter((c) => c.id !== material.id),
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

      <MaterialModal
        isOpen={showModal}
        material={selectedMaterial}
        onClose={() => {
          setShowModal(false);
          setSelectedMaterial(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}

export default Materials;
