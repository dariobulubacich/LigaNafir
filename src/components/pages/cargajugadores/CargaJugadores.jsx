import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./cargajugadores.css";

function CargaJugadores() {
  const location = useLocation();
  const numeroFechaInicial = location.state?.numeroFecha || "";
  const navigate = useNavigate(); // ⬅ Hook para redireccionar después de cerrar sesión

  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");
  const [condicion, setCondicion] = useState("");
  const [numeroFecha, setNumeroFecha] = useState(numeroFechaInicial);
  const [jugadorEncontrado, setJugadorEncontrado] = useState(null);
  const [observaciones, setObservaciones] = useState(null);

  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");

  const auth = getAuth();

  // Cargar torneos desde Firebase
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "torneos"));
        const torneosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTorneos(torneosList);
      } catch (error) {
        console.error("Error al obtener torneos:", error);
      }
    };

    fetchTorneos();
  }, []);

  // Buscar jugador en Firebase y actualizar estado
  const buscarJugador = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("carnet", "==", carnet));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const jugadorDoc = querySnapshot.docs[0];

        // Asegurar que la condición (habilitado) es la más reciente
        const jugadorRef = doc(db, "jugadores", jugadorDoc.id);
        const jugadorSnap = await getDoc(jugadorRef);
        const jugadorActualizado = jugadorSnap.data();

        setJugadorEncontrado({ id: jugadorDoc.id, ...jugadorActualizado });
        setNombre(jugadorActualizado.nombre);
        setApellido(jugadorActualizado.apellido);
        setClub(jugadorActualizado.club);
        setCondicion(
          jugadorActualizado.habilitado ? "Habilitado" : "Inhabilitado"
        );
        setCategoria(jugadorActualizado.categoria);
      } else {
        Swal.fire({
          title: "Jugador no encontrado",
          text: "Por favor verifica el Nº de carnet ingresado.",
          icon: "error",
        });
        setJugadorEncontrado(null);
      }
    } catch (error) {
      console.error("Error al buscar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo buscar el jugador.",
        icon: "error",
      });
    }
  };

  // Guardar datos del jugador en la colección "fechasGuardadas"
  const guardarDatos = async (e) => {
    e.preventDefault();

    if (!torneoSeleccionado) {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar un torneo antes de guardar.",
        icon: "error",
      });
      return;
    }

    if (!jugadorEncontrado) {
      Swal.fire({
        title: "Error",
        text: "Busca un jugador antes de guardar los datos.",
        icon: "error",
      });
      return;
    }

    try {
      const usuarioActual = auth.currentUser
        ? auth.currentUser.email
        : "Anónimo";
      const fechaGuardado = new Date().toLocaleDateString("es-ES");
      const horaGuardado = new Date().toLocaleTimeString("es-ES"); // ⏰ Guardar la hora exacta

      await addDoc(collection(db, "fechasGuardadas"), {
        carnet,
        nombre,
        apellido,
        club,
        condicion,
        categoria,
        numeroCamiseta,
        numeroFecha,
        observaciones,
        torneo: torneoSeleccionado,
        usuario: usuarioActual,
        fechaGuardado,
        horaGuardado, // Nuevo campo con la hora
      });

      Swal.fire({
        title: "Datos guardados correctamente",
        text: `Jugador: ${nombre} ${apellido}, Fecha: ${numeroFecha}, Club: ${club}, Hora: ${horaGuardado}, Observaciones:${observaciones}`,
        icon: "success",
      });

      // Limpiar formulario
      setCarnet("");
      setNombre("");
      setApellido("");
      setClub("");
      setCondicion("");
      setCategoria("");
      setNumeroCamiseta("");
      setObservaciones("");
      setJugadorEncontrado(null);
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron guardar los datos.",
        icon: "error",
      });
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire(
        "Sesión cerrada",
        "Has cerrado sesión correctamente.",
        "success"
      );
      navigate("/"); // ⬅ Redirige a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire("Error", "No se pudo cerrar sesión.", "error");
    }
  };

  return (
    <div className="div-carga">
      <form onSubmit={guardarDatos} className="form-container">
        {/* Botón de Cerrar Sesión */}
        <button onClick={handleLogout} className="cerrar-sesion-button">
          Cerrar Sesión
        </button>
        <h3 className="form-title">Carga de Jugadores</h3>

        {/* Selección del Torneo */}
        <div className="form-group">
          <label className="form-label">Selecciona un Torneo</label>
          <select
            className="input"
            value={torneoSeleccionado}
            onChange={(e) => setTorneoSeleccionado(e.target.value)}
            required
          >
            <option value="">-- Selecciona un torneo --</option>
            {torneos.map((torneo) => (
              <option key={torneo.id} value={torneo.id}>
                {torneo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numeroFecha" className="form-label">
            Nº de Fecha
          </label>
          <input
            id="numeroFecha"
            type="number"
            className="form-input"
            value={numeroFecha}
            onChange={(e) => setNumeroFecha(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="observaciones" className="form-label">
            Datos del Dni
          </label>
          <input
            id="observaciones"
            type="text"
            className="form-input"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="carnet" className="form-label">
            Nº de Carnet
          </label>
          <input
            id="carnet"
            type="number"
            className="form-input"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
          />
        </div>

        <button type="button" className="buscar-button" onClick={buscarJugador}>
          Buscar Jugador
        </button>

        {jugadorEncontrado && (
          <div className="jugador-info">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                className="form-jugador"
                type="text"
                value={nombre}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                className="form-jugador"
                type="text"
                value={apellido}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Club</label>
              <input
                className="form-jugador"
                type="text"
                value={club}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <input
                className="form-jugador"
                type="text"
                value={categoria}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Habilitado</label>
              <input
                className="form-jugador"
                type="text"
                value={condicion}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nº Camiseta</label>
              <input
                className="form-camiseta"
                type="number"
                value={numeroCamiseta}
                onChange={(e) => setNumeroCamiseta(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="agregar-button">
          Guardar
        </button>
      </form>
    </div>
  );
}

export default CargaJugadores;
