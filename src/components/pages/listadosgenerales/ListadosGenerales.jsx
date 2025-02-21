import { useState } from "react";
import ListarJugadores from "../listados/ListarJugadores";
import ListaClubes from "../listaclubes/ListaClubes";

function ListadosGenerales() {
  const [mostrarListarJugadores, setMostrarListarJugadores] = useState(false);
  const [mostrarListaClubes, setMostrarListaClubes] = useState(false);

  const ClickBotonListarJugadores = () => {
    setMostrarListarJugadores(true); // Mostrar el componente cuando se haga clic
  };
  const ClickBotonListaClubes = () => {
    setMostrarListaClubes(true); // Mostrar el componente cuando se haga clic
  };
  const cerrarListarJugadores = () => {
    setMostrarListarJugadores(false); // Ocultar el componente cuando se cierre
  };
  const cerrarListaClubes = () => {
    setMostrarListaClubes(false); // Ocultar el componente cuando se cierre
  };

  return (
    <div>
      <div className="div-titulo">
        <h1>Gestión de Listados</h1>
      </div>
      <div className="div-barra">
        {/* Botón para abrir el componente */}
        <button
          className="button-notificaciones"
          onClick={ClickBotonListarJugadores}
        >
          Listar Jugadores
        </button>

        {/* Mostrar el componente EnviarMensajes cuando el estado sea true */}
        {mostrarListarJugadores && (
          <div className="style-div">
            <button className="button-cerrar" onClick={cerrarListarJugadores}>
              Cerrar
            </button>
            <ListarJugadores />
          </div>
        )}

        {/* Botón para abrir el componente */}
        <button
          className="button-notificaciones"
          onClick={ClickBotonListaClubes}
        >
          Listar Clubes
        </button>

        {/* Mostrar el componente EnviarMensajes cuando el estado sea true */}
        {mostrarListaClubes && (
          <div className="style-div">
            <button className="button-cerrar" onClick={cerrarListaClubes}>
              Cerrar
            </button>
            <ListaClubes />
          </div>
        )}
      </div>
    </div>
  );
}

export default ListadosGenerales;
