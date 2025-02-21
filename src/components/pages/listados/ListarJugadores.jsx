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
  const fetchJugadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fechasGuardadas"));
      let jugadoresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Mapear y obtener el nombre del torneo si está referenciado
      for (let jugador of jugadoresList) {
        if (jugador.torneo) {
          const torneoRef = doc(db, "torneos", jugador.torneo); // Referencia al torneo
          const torneoSnap = await getDoc(torneoRef);
          if (torneoSnap.exists()) {
            jugador.torneo = torneoSnap.data().nombre || "Desconocido"; // Guardamos el nombre
          } else {
            jugador.torneo = "Desconocido";
          }
        }
      }

      setJugadores(jugadoresList);
      return jugadoresList;
    } catch (error) {
      console.error("Error al obtener jugadores:", error);
      return [];
    }
  };

  // Filtrar jugadores
  const handleFilter = async () => {
    const allJugadores = jugadores.length ? jugadores : await fetchJugadores();
    const term = searchTerm.toLowerCase();

    const filtered = allJugadores.filter((jugador) => {
      let matchesFilter = jugador[filterBy]
        ?.toString()
        .toLowerCase()
        .includes(term);

      // Si hay rango de fechas, filtrar por fechaGuardado
      if (startDate && endDate && jugador.fechaGuardado) {
        // Convertir fechaGuardado a Date si está en formato string ISO 8601
        const jugadorFecha = new Date(jugador.fechaGuardado);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Incluir todo el día

        if (jugadorFecha < start || jugadorFecha > end) {
          matchesFilter = false;
        }
      }

      return matchesFilter;
    });

    setFilteredJugadores(filtered);
  };
  useEffect(() => {
    fetchJugadores();
  }, []);

  // Exportar a Excel
  const exportToExcel = () => {
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
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Reordenar manualmente las columnas para asegurarnos de que siguen el orden requerido
    const columnsOrder = [
      "Carnet",
      "Nombre",
      "Apellido",
      "Club",
      "Categoría",
      "Nº Camiseta",
      "Fecha Guardado",
      "Torneo",
    ];

    worksheet["!cols"] = columnsOrder.map(() => ({ wch: 20 })); // Ajuste opcional del ancho de columna

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");
    XLSX.writeFile(workbook, "ListadoJugadores.xlsx");
  };

  // Imprimir tabla
  const printTable = () => {
    const printContents = document.getElementById("jugadoresTable").outerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Listado de Jugadores</title></head><body>"
    );
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
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
          <option value="torneo">Torneo</option>{" "}
          {/* Agregué torneo como filtro */}
        </select>
        <input
          className="input"
          type="text"
          placeholder={`Buscar por ${filterBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="button-filter" onClick={handleFilter}>
          Filtrar
        </button>
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
        <button className="button-export" onClick={printTable}>
          Imprimir
        </button>
        <button
          className="volver-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          Volver al Panel de Administrador
        </button>
      </div>

      {filteredJugadores.length === 0 ? (
        <p>No hay jugadores para mostrar.</p>
      ) : (
        <table id="jugadoresTable" className="jugadores-table">
          <thead>
            <tr>
              <th>Carnet</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Club</th>
              <th>Categoría</th>
              <th>Nº Camiseta</th>
              <th>Fecha Guardado</th>
              <th>Torneo</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {filteredJugadores.map((jugador) => (
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
                      : jugador.fechaGuardado // Si es string, lo muestra directamente
                    : "No registrado"}
                </td>
                <td>{jugador.torneo || "No asignado"}</td>{" "}
                {/* Muestra el torneo */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListarJugadores;
