import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./porcentajejuego.css";

function PorcentajeJuego() {
  const [jugadores, setJugadores] = useState([]);
  const [totalFechas, setTotalFechas] = useState(1);
  const [jugadoresConPorcentaje, setJugadoresConPorcentaje] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [clubSeleccionado, setClubSeleccionado] = useState("");

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fechasGuardadas"));
        const jugadoresMap = new Map();
        let maxFechas = 0;
        const categoriasSet = new Set();
        const clubesSet = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { carnet, nombre, apellido, numeroFecha, club, categoria } =
            data;

          if (!jugadoresMap.has(carnet)) {
            jugadoresMap.set(carnet, {
              carnet,
              nombre,
              apellido,
              club,
              categoria,
              fechasJugadas: new Set(),
            });
          }

          jugadoresMap.get(carnet).fechasJugadas.add(numeroFecha);
          maxFechas = Math.max(maxFechas, Number(numeroFecha));

          categoriasSet.add(categoria);
          clubesSet.add(club);
        });

        const listaJugadores = Array.from(jugadoresMap.values()).map(
          (jugador) => ({
            ...jugador,
            totalFechas: jugador.fechasJugadas.size,
          })
        );

        setJugadores(listaJugadores);
        setTotalFechas(maxFechas);
        setCategorias([...categoriasSet]);
        setClubes([...clubesSet]);
        calcularPorcentaje(listaJugadores, maxFechas);
      } catch (error) {
        console.error("Error al obtener jugadores:", error);
      }
    };

    fetchJugadores();
  }, []);

  const calcularPorcentaje = (listaJugadores, total) => {
    const jugadoresConDatos = listaJugadores.map((jugador) => ({
      ...jugador,
      porcentaje:
        total > 0 ? ((jugador.totalFechas / total) * 100).toFixed(2) : 0,
    }));
    setJugadoresConPorcentaje(jugadoresConDatos);
  };

  // Filtrar jugadores según la selección
  const jugadoresFiltrados = jugadoresConPorcentaje.filter(
    (jugador) =>
      (categoriaSeleccionada === "" ||
        jugador.categoria === categoriaSeleccionada) &&
      (clubSeleccionado === "" || jugador.club === clubSeleccionado)
  );

  return (
    <div className="estadisticas-container">
      <h3>Porcentaje de Juego por Jugador</h3>

      <label>Total de Fechas del Torneo:</label>
      <input
        type="number"
        value={totalFechas}
        onChange={(e) => {
          const nuevoTotal = Number(e.target.value);
          setTotalFechas(nuevoTotal);
          calcularPorcentaje(jugadores, nuevoTotal);
        }}
        min="1"
      />

      <div className="filtros">
        <label>Filtrar por Categoría:</label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Filtrar por Club:</label>
        <select
          value={clubSeleccionado}
          onChange={(e) => setClubSeleccionado(e.target.value)}
        >
          <option value="">Todos</option>
          {clubes.map((club, index) => (
            <option key={index} value={club}>
              {club}
            </option>
          ))}
        </select>
      </div>

      <ul className="jugadores-list">
        {jugadoresFiltrados.map((jugador) => (
          <li key={jugador.carnet}>
            {jugador.nombre} {jugador.apellido} - Club: {jugador.club} -
            Categoría: {jugador.categoria} - Fechas jugadas:{" "}
            {jugador.totalFechas} - <strong>{jugador.porcentaje}%</strong> del
            total
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PorcentajeJuego;
