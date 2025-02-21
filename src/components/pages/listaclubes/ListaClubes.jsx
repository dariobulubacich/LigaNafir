import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import * as XLSX from "xlsx"; // Para exportar a Excel
import { useNavigate } from "react-router-dom";

const ListaClubes = () => {
  const [clubes, setClubes] = useState([]); // Lista de nombres de clubes
  const [cantidadJugadores, setCantidadJugadores] = useState(0); // Cantidad de jugadores por club
  const [jugadores, setJugadores] = useState([]); // Lista para exportar
  const [selectedClub, setSelectedClub] = useState(""); // Estado del club seleccionado
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const jugadoresRef = collection(db, "jugadores");
        const querySnapshot = await getDocs(jugadoresRef);

        const clubesSet = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.club) {
            clubesSet.add(data.club);
          }
        });

        setClubes(Array.from(clubesSet));
      } catch (error) {
        console.error("Error al obtener clubes:", error);
      }
    };

    fetchClubes();
  }, []);

  const fetchJugadoresPorClub = async (club) => {
    setLoading(true);
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("club", "==", club));
      const querySnapshot = await getDocs(q);

      const jugadoresData = [];
      querySnapshot.forEach((doc) => {
        jugadoresData.push(doc.data());
      });

      setCantidadJugadores(jugadoresData.length); // Guarda la cantidad de jugadores
      setJugadores(jugadoresData); // Guarda los jugadores solo para exportar
    } catch (error) {
      console.error("Error al obtener jugadores:", error);
    }
    setLoading(false);
  };

  const handleClubChange = (e) => {
    const clubSeleccionado = e.target.value;
    setSelectedClub(clubSeleccionado);

    if (clubSeleccionado) {
      fetchJugadoresPorClub(clubSeleccionado);
    } else {
      setCantidadJugadores(0);
      setJugadores([]);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(jugadores);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jugadores");
    XLSX.writeFile(wb, `Jugadores_${selectedClub}.xlsx`);
  };
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>Listado de Jugadores por Club</h2>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admin
        </button>
      </div>

      {/* Filtro de clubes */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Selecciona un Club:
        </label>
        <select
          value={selectedClub}
          onChange={handleClubChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Selecciona un club</option>
          {clubes.map((club) => (
            <option key={club} value={club}>
              {club}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando jugadores...</p>
      ) : selectedClub ? (
        <div>
          <h3>
            Jugadores en {selectedClub}: {cantidadJugadores}
          </h3>
          {jugadores.length > 0 && (
            <button
              onClick={exportToExcel}
              style={{
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Exportar a Excel
            </button>
          )}
        </div>
      ) : (
        <p>Selecciona un club para ver la cantidad de jugadores.</p>
      )}
    </div>
  );
};

export default ListaClubes;
