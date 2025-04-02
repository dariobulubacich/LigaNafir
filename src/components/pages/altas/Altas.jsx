import { useState } from "react";
import AgregarClubes from "../agregarclubes/AgregarClubes";
import AgregarJugadores from "../agregarjugadores/AgregarJugadores";
import AltaTorneos from "../altastorneos/AltaTorneos";
import { useNavigate } from "react-router-dom";
import GestionCategorias from "../gestioncategorias/GestionCategorias";

function ListadosGenerales() {
  const [mostrarComponente, setMostrarComponente] = useState(null);
  const navigate = useNavigate();

  const ClickBotonAgregarJugadores = () => {
    setMostrarComponente("jugadores"); // Mostrar solo AgregarJugadores
  };

  const ClickBotonAgregarClubes = () => {
    setMostrarComponente("clubes"); // Mostrar solo AgregarClubes
  };
  const ClickBotonAltaToneos = () => {
    setMostrarComponente("torneos"); // Mostrar solo AltaTorneos
  };
  const ClickBotonGestionCategorias = () => {
    setMostrarComponente("gestioncategorias"); // Mostrar solo AltaTorneos
  };

  // Función para navegar al AdminDashboard
  const goToExportFechasExcel = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div>
      {/* Mostrar botones solo si no hay un formulario abierto */}
      {mostrarComponente === null && (
        <div className="div-barra">
          <button
            className="button-notificaciones"
            onClick={ClickBotonAgregarJugadores}
          >
            Altas Jugadores
          </button>

          <button
            className="button-notificaciones"
            onClick={ClickBotonAgregarClubes}
          >
            Altas Clubes
          </button>
          <button
            className="button-notificaciones"
            onClick={ClickBotonAltaToneos}
          >
            Altas Torneos
          </button>
          <button
            className="button-notificaciones"
            onClick={ClickBotonGestionCategorias}
          >
            Gestion Categorias Femenino
          </button>
        </div>
      )}

      {/* Mostrar el formulario seleccionado */}
      {mostrarComponente === "jugadores" && <AgregarJugadores />}
      {mostrarComponente === "clubes" && <AgregarClubes />}
      {mostrarComponente === "torneos" && <AltaTorneos />}
      {mostrarComponente === "gestioncategorias" && <GestionCategorias />}
      <button className="volver-button" onClick={goToExportFechasExcel}>
        Volver al Panel de Admin
      </button>
    </div>
  );
}

export default ListadosGenerales;
