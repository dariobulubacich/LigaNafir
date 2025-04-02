import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./FiltrosFechasGuardadas.css";
import { useNavigate } from "react-router-dom";

function FiltrosFechasGuardadas() {
  const [clubes, setClubes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroClub, setFiltroClub] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroNumeroFecha, setFiltroNumeroFecha] = useState("");
  const [jugadores, setJugadores] = useState([]);
  const navigate = useNavigate();

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

        setClubes([...clubesSet].sort());
        setCategorias([...categoriasSet].sort((a, b) => b - a));
        setJugadores(jugadoresList);
      } catch (error) {
        console.error("Error al obtener datos: ", error);
      }
    };

    obtenerDatos();
  }, []);

  const convertirHoraAMilisegundos = (hora) => {
    if (!hora) return null;
    const [hh, mm, ss] = hora.split(":").map(Number);
    return hh * 3600000 + mm * 60000 + ss * 1000;
  };

  const filtrarJugadores = () => {
    let filtrados = jugadores.filter(
      (j) =>
        j.club === filtroClub &&
        j.categoria === filtroCategoria &&
        (!filtroNumeroFecha || j.numeroFecha === filtroNumeroFecha)
    );

    filtrados = filtrados.map((j) => ({
      ...j,
      horaMilisegundos: convertirHoraAMilisegundos(j.horaGuardado),
    }));

    if (filtrados.length === 0) return [];

    const primerTimestamp = filtrados[0].horaMilisegundos;
    const limiteTimestamp = primerTimestamp + 5 * 60 * 1000;

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
      )
      .sort((a, b) => a.numeroCamiseta - b.numeroCamiseta);
  };

  const jugadoresFiltrados = filtrarJugadores();

  return (
    <div className="contenedor">
      <h2 className="h2-fechas">Filtrar Jugadores</h2>
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
      <div className="filtros">
        <label>Filtrar por Número de Fecha:</label>
        <input
          type="number"
          value={filtroNumeroFecha}
          onChange={(e) => setFiltroNumeroFecha(e.target.value)}
        />
      </div>
      {filtroClub && filtroCategoria && (
        <>
          <h3>Lista de Jugadores</h3>
          {jugadoresFiltrados.length > 0 ? (
            <ul>
              {jugadoresFiltrados.map((jugador, index) => (
                <li key={index}>
                  {`${jugador.numeroCamiseta} - ${jugador.nombre} ${jugador.apellido} - ${jugador.club} - ${jugador.categoria} - ${jugador.horaGuardado}`}
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
      <button className="buttons" onClick={() => navigate("/admin-dashboard")}>
        Panel de Administrador
      </button>
    </div>
  );
}

export default FiltrosFechasGuardadas;
