import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function Login() {
  const navigate = useNavigate();
  const inputUsername = useRef(null);
  const inputPassword = useRef(null);

  async function handleLogin() {
    try {
      const response = await api.post("/login/", {
        username: inputUsername.current.value,
        password: inputPassword.current.value,
      });

      // futuramente será JWT
      localStorage.setItem("token", response.data.access);

      navigate("/Dashboard");
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="Container">
      <h1>Login</h1>
      <form action={handleLogin}>
        <input placeholder="Username" name="username" ref={inputUsername} />
        <input
          placeholder="Senha"
          type="password"
          name="password"
          ref={inputPassword}
        />
        <button onClick="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
