import { useNavigate } from "react-router-dom";
import "./admindashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Bienvenido al panel de administrador</h1>
      <div>
        <nav>
          <ul className="ul-nav">
            <li>
              <button onClick={() => navigate("/Altas")}>Altas</button>
            </li>

            <li>
              <button onClick={() => navigate("/BuscarJugadores")}>
                Buscar Jugadores
              </button>
            </li>

            <li>
              <button onClick={() => navigate("/CargaJugadores")}>
                Carga Jugadores
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/Carnets")}>Carnets</button>
            </li>
            <li>
              <button onClick={() => navigate("/ImportarExcel")}>
                Importaciones masivas
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/ListadosGenerales")}>
                Listados Generales
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/PorcentajeJuego")}>65 %</button>
            </li>
            <li>
              <button onClick={() => navigate("/CambiarClubMasivo")}>
                Cambiar Club Masivamente
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/FiltrosFechasGuardadas")}>
                Filtros Fechas
              </button>
            </li>

            <li>
              <button onClick={() => navigate("/RegisterUser")}>
                Registrar Usuarios
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
