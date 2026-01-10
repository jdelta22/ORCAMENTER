import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function Register() {
  const navigate = useNavigate();

  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);

  async function handleRegister() {
    try {
      await api.post("/auth/register/", {
        username: inputName.current.value,
        email: inputEmail.current.value,
        password: inputPassword.current.value,
      });

      // 👉 redireciona para login
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar");
    }
  }

  return (
    <div className="Container">
      <h1>Cadastro</h1>
      <form action="{handleRegister}">
        <input placeholder="Username" ref={inputName} />
        <input placeholder="Email" ref={inputEmail} />
        <input placeholder="Senha" type="password" ref={inputPassword} />
        <button onClick="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;
