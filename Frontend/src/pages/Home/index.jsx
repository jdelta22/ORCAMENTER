import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="Container">
      <div className="apresentation">
        <h1>Orçamenter</h1>
        <h2>Seu orçamento, fácil e rápido</h2>
        <p>
          <p>
            O Orçamenter é uma aplicação web desenvolvida para facilitar a
            criação e o gerenciamento de orçamentos para pequenos negócios e
            profissionais autônomos.
          </p>{" "}
          <p>
            Com uma interface intuitiva e recursos práticos, o Orçamenter
            permite que você crie orçamentos personalizados em poucos minutos,
            acompanhe o status dos seus projetos e mantenha um histórico
            organizado de todas as suas transações.
          </p>
        </p>
        <button onClick={() => navigate("/register")}>Registre-se</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Home;
