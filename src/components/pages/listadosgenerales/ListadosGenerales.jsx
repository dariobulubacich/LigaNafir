import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListaClubes from "../listaclubes/ListaClubes";
import ExportFechasExcel from "../exportarfechasjugadas/ExportFechasExcel";

function ListadosGenerales() {
  const [mostrarListaClubes, setMostrarListaClubes] = useState(false);
  const [mostrarExportFechasExcel, setMostrarExportFechasExcel] =
    useState(false);
  const navigate = useNavigate();

  const ClickBotonListaClubes = () => {
    setMostrarListaClubes(true);
  };
  const ClickBotonExportarFechasExcel = () => {
    setMostrarExportFechasExcel(true);
  };

  const cerrarExportFechasExcel = () => {
    setMostrarExportFechasExcel(false);
  };
  const cerrarListaClubes = () => {
    setMostrarListaClubes(false);
  };

  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div>
      <div className="div-titulo">
        <h1>Gestión de Listados</h1>
      </div>
      <div className="div-barra">
        {!mostrarExportFechasExcel && (
          <button
            className="button-notificaciones"
            onClick={ClickBotonExportarFechasExcel}
          >
            Exportar Fechas Jugadas
          </button>
        )}

        {mostrarExportFechasExcel && (
          <div className="style-div">
            <ExportFechasExcel />
            <button className="button-cerrar" onClick={cerrarExportFechasExcel}>
              Cerrar
            </button>
          </div>
        )}

        {!mostrarExportFechasExcel && !mostrarListaClubes && (
          <button
            className="button-notificaciones"
            onClick={ClickBotonListaClubes}
          >
            Listar Clubes
          </button>
        )}

        {mostrarListaClubes && (
          <div className="style-div">
            <ListaClubes />
            <button className="button-cerrar" onClick={cerrarListaClubes}>
              Cerrar
            </button>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={goToAdminDashboard}>Volver al Panel de Admin</button>
      </div>
    </div>
  );
}

export default ListadosGenerales;
