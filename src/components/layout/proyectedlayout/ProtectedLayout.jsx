import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase"; // Importar Firebase auth
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";

export function ProtectedLayout() {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire("Sesion cerrada con exito");
        navigate("/"); // Redirigir al login después de cerrar sesión
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  // Verificar si el usuario está autenticado
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/" />; // Redirigir al login si no está autenticado
  }

  return (
    <div className="protected-layout">
      <nav className="menu">
        <Outlet />
        <Grid container={true}>
          <Grid size={{ xs: 12 }} textAlign={"center"} padding={"3.5rem"}>
            <button onClick={() => navigate("/ListarJugadores")}>
              Listar Jugadores
            </button>
            <button onClick={() => navigate("/AgregarJugadores")}>
              Agregar Jugadores
            </button>
            <button onClick={() => navigate("/CargaJugadores")}>
              Cargar Jugadores
            </button>
            <button onClick={handleLogout} style={{ fontSize: "1.5rem" }}>
              Cerrar Sesión
            </button>
            {/* <button>cargar todos los jugadores</button> */}
          </Grid>
        </Grid>
      </nav>
    </div>
  );
}
