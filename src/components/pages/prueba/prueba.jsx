import { useNavigate } from "react-router-dom";

function Prueba() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-menu">
        <button onClick={() => handleNavigation("/CargaJugadores")}>
          Cargar Jugadores
        </button>
      </div>
    </div>
  );
}

export default Prueba;
