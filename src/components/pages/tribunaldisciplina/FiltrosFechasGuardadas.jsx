import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./FiltrosFechasGuardadas.css";

function FiltrosFechasGuardadas() {
  const [clubes, setClubes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroClub, setFiltroClub] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fechasGuardadas"));
        const clubesSet = new Set();
        const categoriasSet = new Set();
        const jugadoresList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          clubesSet.add(data.club);
          categoriasSet.add(data.categoria);
          jugadoresList.push(data);
        });

        setClubes([...clubesSet]);
        setCategorias([...categoriasSet]);
        setJugadores(jugadoresList);
      } catch (error) {
        console.error("Error al obtener datos: ", error);
      }
    };

    obtenerDatos();
  }, []);

  // Función para convertir "HH:mm:ss" a milisegundos desde la medianoche
  const convertirHoraAMilisegundos = (hora) => {
    if (!hora) return null;
    const [hh, mm, ss] = hora.split(":").map(Number);
    return hh * 3600000 + mm * 60000 + ss * 1000;
  };

  const filtrarJugadores = () => {
    if (!filtroClub || !filtroCategoria) return [];

    // Filtra jugadores del club y categoría seleccionados
    const jugadoresCategoria = jugadores
      .filter((j) => j.club === filtroClub && j.categoria === filtroCategoria)
      .map((j) => ({
        ...j,
        horaMilisegundos: convertirHoraAMilisegundos(j.horaGuardado),
      }))
      .sort((a, b) => a.horaMilisegundos - b.horaMilisegundos);

    if (jugadoresCategoria.length === 0) return [];

    const primerTimestamp = jugadoresCategoria[0].horaMilisegundos;
    const limiteTimestamp = primerTimestamp + 10 * 60 * 1000;

    // Filtra todos los jugadores del club dentro del rango de 10 minutos
    return jugadores
      .filter((j) => j.club === filtroClub)
      .map((j) => ({
        ...j,
        horaMilisegundos: convertirHoraAMilisegundos(j.horaGuardado),
      }))
      .filter(
        (j) =>
          j.horaMilisegundos >= primerTimestamp &&
          j.horaMilisegundos <= limiteTimestamp
      );
  };

  const jugadoresFiltrados = filtrarJugadores();

  return (
    <div className="contenedor">
      <h2>Filtrar Jugadores</h2>
      <div className="filtros">
        <label>Seleccionar Club:</label>
        <select
          value={filtroClub}
          onChange={(e) => setFiltroClub(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {clubes.map((club, index) => (
            <option key={index} value={club}>
              {club}
            </option>
          ))}
        </select>
      </div>
      <div className="filtros">
        <label>Seleccionar Categoría:</label>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>
      {filtroClub && filtroCategoria && (
        <>
          <h3>Lista de Jugadores</h3>
          {jugadoresFiltrados.length > 0 ? (
            <ul>
              {jugadoresFiltrados.map((jugador, index) => (
                <li key={index}>
                  {`${jugador.nombre} ${jugador.apellido} - ${jugador.club} - ${jugador.categoria} - ${jugador.horaGuardado}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="parrafo-tribunal">
              No se encontraron jugadores en ese rango de tiempo.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FiltrosFechasGuardadas;
