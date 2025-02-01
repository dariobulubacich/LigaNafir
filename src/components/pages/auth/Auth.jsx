import { useState } from "react";
import { auth, db } from "../../../firebase"; // Importa tu configuración de Firebase
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import Grid from "@mui/material/Grid2";
// import { Typography } from "@mui/material";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Inicio de sesión
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/cargajugadores");
        }
      } else {
        throw new Error("El usuario no tiene datos asociados en Firestore");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes ingresar una nueva contraseña.",
      });
      return;
    }

    try {
      const user = auth.currentUser;

      if (user) {
        await updatePassword(user, newPassword);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Contraseña actualizada correctamente.",
        });
        setNewPassword("");
        setShowChangePassword(false);
      } else {
        throw new Error("No se pudo autenticar al usuario.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
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
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Campo de Contraseña con Mostrar/Ocultar */}
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        ¿Olvidaste tu contraseña?{" "}
        <button onClick={() => setShowChangePassword(!showChangePassword)}>
          Cambiar contraseña
        </button>
      </p>
      {showChangePassword && (
        <form onSubmit={handleChangePassword}>
          <div className="password-container">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">Cambiar Contraseña</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
