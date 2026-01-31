import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="Container-page">
      <div className="home-container">
        <h1>Orçamenter</h1>
        <h2>Seu orçamento, fácil e rápido</h2>

        <p>
          O Orçamenter é uma aplicação web desenvolvida para facilitar a criação
          e o gerenciamento de orçamentos para pequenos negócios e profissionais
          autônomos.
        </p>

        <p>
          Crie orçamentos personalizados em poucos minutos, acompanhe o status
          dos seus projetos e mantenha um histórico organizado de todas as suas
          transações.
        </p>

        <div className="home-actions">
          <button onClick={() => navigate("/register")}>Registre-se</button>
          <button className="secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
