import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import "./listados.css";

function ListarJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [filteredJugadores, setFilteredJugadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("apellido");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  // Obtener jugadores y torneos desde Firestore
  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fechasGuardadas"));
        let jugadoresList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (let jugador of jugadoresList) {
          if (jugador.torneo) {
            const torneoRef = doc(db, "torneos", jugador.torneo);
            const torneoSnap = await getDoc(torneoRef);
            jugador.torneo = torneoSnap.exists()
              ? torneoSnap.data().nombre || "Desconocido"
              : "Desconocido";
          }
        }

        setJugadores(jugadoresList);
        setFilteredJugadores(jugadoresList); // Inicializa con todos los jugadores
      } catch (error) {
        console.error("Error al obtener jugadores:", error);
      }
    };

    fetchJugadores();
  }, []);

  // Filtrar jugadores cuando cambian los filtros
  useEffect(() => {
    const handleFilter = () => {
      let filtered = jugadores.filter((jugador) =>
        jugador[filterBy]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filtered = filtered.filter((jugador) => {
          if (!jugador.fechaGuardado) return false;

          const jugadorFecha = jugador.fechaGuardado.seconds
            ? new Date(jugador.fechaGuardado.seconds * 1000)
            : new Date(jugador.fechaGuardado);

          return jugadorFecha >= start && jugadorFecha <= end;
        });
      }

      setFilteredJugadores(filtered);
    };

    handleFilter();
  }, [jugadores, searchTerm, startDate, endDate, filterBy]);

  // Exportar a Excel
  const exportToExcel = () => {
    if (filteredJugadores.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const formattedData = filteredJugadores.map((jugador) => ({
      Carnet: jugador.carnet || "",
      Nombre: jugador.nombre || "",
      Apellido: jugador.apellido || "",
      Club: jugador.club || "",
      Categoría: jugador.categoria || "",
      "Nº Camiseta": jugador.numeroCamiseta || "",
      "Fecha Guardado": jugador.fechaGuardado
        ? jugador.fechaGuardado.seconds
          ? new Date(jugador.fechaGuardado.seconds * 1000).toLocaleDateString(
              "es-ES"
            )
          : jugador.fechaGuardado
        : "No registrado",
      Torneo: jugador.torneo || "No asignado",
      Hora: jugador.horaGuardado || "No asignado",
      Observaciones: jugador.observaciones || "No asignado",
      Usuario: jugador.usuario || "No asignado",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");
    XLSX.writeFile(workbook, "ListadoJugadores.xlsx");
  };

  return (
    <div className="listar-jugadores">
      <h2>Listado de Jugadores</h2>

      <div className="actions">
        <select
          className="input"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="apellido">Apellido</option>
          <option value="carnet">Carnet</option>
          <option value="club">Club</option>
          <option value="torneo">Torneo</option>
        </select>
        <input
          className="input"
          type="text"
          placeholder={`Buscar por ${filterBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="date-filters">
        <label>
          Desde:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Hasta:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className="button-exp-imp">
        <button className="button-export" onClick={exportToExcel}>
          Exportar a Excel
        </button>
        <button
          className="volver-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          Volver al Panel de Administrador
        </button>
      </div>

      <table className="jugadores-table">
        <thead>
          <tr>
            <th>Carnet</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Club</th>
            <th>Categoría</th>
            <th>Nº Camiseta</th>
            <th>Fecha Guardado</th>
            <th>Torneo</th>
            <th>Hora Guardado</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {filteredJugadores.length > 0 ? (
            filteredJugadores.map((jugador) => (
              <tr key={jugador.id}>
                <td>{jugador.carnet}</td>
                <td>{jugador.nombre}</td>
                <td>{jugador.apellido}</td>
                <td>{jugador.club}</td>
                <td>{jugador.categoria}</td>
                <td>{jugador.numeroCamiseta}</td>
                <td>
                  {jugador.fechaGuardado
                    ? jugador.fechaGuardado.seconds
                      ? new Date(
                          jugador.fechaGuardado.seconds * 1000
                        ).toLocaleDateString("es-ES")
                      : jugador.fechaGuardado
                    : "No registrado"}
                </td>
                <td>{jugador.torneo || "No asignado"}</td>
                <td>{jugador.horaGuardado || "No registrada"}</td>
                <td>{jugador.usuario || "Desconocido"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No se encontraron jugadores.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListarJugadores;
