import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="admin-menu">
        <button onClick={() => handleNavigation("/CargarJugadores")}>
          Cargar Jugadores
        </button>
        <button onClick={() => handleNavigation("/ListarJugadores")}>
          Listar Jugadores
        </button>
        <button onClick={() => handleNavigation("/AgregarJugadores")}>
          Agregar Jugadores
        </button>
      </div>
    </div>
  );
}
export default AdminDashboard;
