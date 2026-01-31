import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function Login() {
  const navigate = useNavigate();
  const inputUsername = useRef(null);
  const inputPassword = useRef(null);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.post("/login/", {
        username: inputUsername.current.value,
        password: inputPassword.current.value,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/dashboard");
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="Container-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" ref={inputUsername} />
          <input placeholder="Senha" type="password" ref={inputPassword} />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
