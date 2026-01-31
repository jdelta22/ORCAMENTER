import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

function Register() {
  const navigate = useNavigate();

  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function validatePassword() {
    if (password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres";
    }

    if (!/[A-Za-z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra";
    }

    if (!/[0-9]/.test(password)) {
      return "A senha deve conter pelo menos um número";
    }

    if (password !== confirm) {
      return "As senhas não coincidem";
    }

    return "";
  }

  async function handleRegister() {
    const validationError = validatePassword();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.post("/auth/register/", {
        username: inputName.current.value,
        email: inputEmail.current.value,
        password: password,
      });

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar");
    }
  }

  return (
    <div className="Container-page">
      <div className="register-container">
        <h1>Cadastro</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <input placeholder="Username" ref={inputName} />
          <input placeholder="Email" ref={inputEmail} />
          <input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            placeholder="Confirmar senha"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
