import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../../../firebase";
import "./auth.css";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import { db } from "../../../firebase";

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();

  // Manejar el inicio de sesión
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar el rol del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "usuario", // Por defecto asignar el rol de "usuario"
      });

      Swal.fire(
        "Registro exitoso",
        "Usuario registrado exitosamente",
        "success"
      );
      navigate("/CargaJugadores"); // Redirigir al cargar jugadores
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: error.message,
      });
    }
  };

  // Manejar el registro
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Consultar el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "administrador") {
          navigate("/AdminDashboard"); // página del administrador
        } else {
          navigate("/CargaJugadores"); //  página del usuario
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "El usuario no tiene rol asignado.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message,
      });
    }
  };

  return (
    <Grid container={true}>
      <Grid style={{ padding: "12rem" }} size={{ xs: 12 }}>
        <div className="auth-container">
          <Typography
            variant="h1"
            style={{ color: "white", fontSize: "8.5rem", width: "100%" }}
          >
            Liga Nafir
          </Typography>
          <Typography
            variant="h3"
            style={{ width: "100%", color: "white", fontSize: "3.5rem" }}
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </Typography>
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <input
              style={{ padding: "0.5rem", fontSize: "2rem", width: "100%" }}
              className="input-aut"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                style={{ padding: "0.5rem", fontSize: "2rem", width: "100%" }}
                className="input-aut"
                type={showPassword ? "text" : "password"} // Cambia el tipo de input
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                style={{
                  padding: "1rem",
                  fontSize: "1.5rem",
                  width: "30%",
                  background: "blue",
                }}
                type="button"
                className="show-password-button"
                onClick={() => setShowPassword(!showPassword)} // Cambia el estado
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div style={{ padding: "1rem" }}>
              <button
                style={{
                  padding: "1rem",
                  fontSize: "2.5rem",
                  width: "100%",
                  background: "blue",
                }}
                type="submit"
              >
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </button>
            </div>
          </form>
          <p style={{ color: "white", fontSize: "2rem" }}>
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
            <button
              style={{ color: "white", fontSize: "3rem" }}
              className="toggle-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </Grid>
    </Grid>
  );
}

export default Auth;
