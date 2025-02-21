import { useState } from "react";
import AgregarClubes from "../agregarclubes/AgregarClubes";
import AgregarJugadores from "../agregarjugadores/AgregarJugadores";
import AltaTorneos from "../altastorneos/AltaTorneos";

function ListadosGenerales() {
  const [mostrarComponente, setMostrarComponente] = useState(null);

  const ClickBotonAgregarJugadores = () => {
    setMostrarComponente("jugadores"); // Mostrar solo AgregarJugadores
  };

  const ClickBotonAgregarClubes = () => {
    setMostrarComponente("clubes"); // Mostrar solo AgregarClubes
  };
  const ClickBotonAltaToneos = () => {
    setMostrarComponente("torneos"); // Mostrar solo AltaTorneos
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
        </div>
      )}

      {/* Mostrar el formulario seleccionado */}
      {mostrarComponente === "jugadores" && <AgregarJugadores />}
      {mostrarComponente === "clubes" && <AgregarClubes />}
      {mostrarComponente === "torneos" && <AltaTorneos />}
    </div>
  );
}

export default ListadosGenerales;
