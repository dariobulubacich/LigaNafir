import { useState } from "react";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // Nuevo estado

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, currentPassword);

      navigate("/CargaJugadores");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message,
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!email || !currentPassword || !newPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        currentPassword
      );
      const user = userCredential.user;

      await updatePassword(user, newPassword);

      Swal.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "Tu contraseña se actualizó correctamente.",
      });

      setNewPassword("");
      setShowChangePassword(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cambiar la contraseña",
        text: error.message,
      });
    }
  };

  return (
    <div className="div-liga">
      <p style={{ fontSize: "2.5rem" }}>Liga Nafir</p>
      <div className="parrafo-iniciosesion">
        <p style={{ fontSize: "1.5rem" }}>Inicio de Sesión</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input-aut"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="password-container">
          <input
            className="input-aut"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Oculto 🔒" : "Muestra 👁"}
          </button>
        </div>

        <div>
          <button type="submit">Iniciar Sesión</button>
        </div>
      </form>

      <p>
        ¿Quieres cambiar tu contraseña?{" "}
        <button onClick={() => setShowChangePassword(!showChangePassword)}>
          Cambiar contraseña
        </button>
      </p>

      {showChangePassword && (
        <form onSubmit={handleChangePassword}>
          <div className="password-container">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "Oculto 🔒" : "Muestra 👁"}
            </button>
          </div>
          <div>
            <button type="submit">Actualizar Contraseña</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
