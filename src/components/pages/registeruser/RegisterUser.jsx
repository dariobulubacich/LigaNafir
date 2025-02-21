import { useState } from "react";
import { auth, db } from "../../../firebase"; // Asegúrate de usar tu configuración de Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import "./registeruser.css";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("users"); // Rol predeterminado, se puede cambiar desde un select
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    try {
      setLoading(true);

      // Registrar usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar información adicional en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role, // Guardar el rol seleccionado
      });

      Swal.fire({
        icon: "success",
        title: "Usuario registrado",
        text: `El usuario con correo ${email} ha sido registrado exitosamente.`,
      });

      // Reiniciar campos
      setEmail("");
      setPassword("");
      setRole("users");
    } catch (error) {
      console.error("Error al registrar usuario: ", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="auth-container">
      Registrar Usuario
      <form onSubmit={handleRegister}>
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
        <div>
          <input
            className="input-aut"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Usuario"}
          </button>
        </div>
      </form>
      <div>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Panel de Administrador
        </button>
      </div>
    </div>
  );
};

export default RegisterUser;
