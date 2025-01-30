import { useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar autenticación
import Swal from "sweetalert2";
import "./cargajugadores.css";
// import Grid from "@mui/material/Grid2";
// import { Typography } from "@mui/material";

function CargaJugadores() {
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");
  const [condicion, setCondicion] = useState("");
  const [numeroFecha, setNumeroFecha] = useState("");
  const [jugadorEncontrado, setJugadorEncontrado] = useState(null);

  const auth = getAuth(); // Obtener instancia de autenticación

  const buscarJugador = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("carnet", "==", carnet));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const jugador = querySnapshot.docs[0];
        const data = jugador.data();

        setJugadorEncontrado({ id: jugador.id, ...data });
        setNombre(data.nombre);
        setApellido(data.apellido);
        setClub(data.club);
        setCondicion(data.condicion);
        setCategoria(data.categoria);
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

  const guardarDatos = async (e) => {
    e.preventDefault();
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
      const fechaGuardado = new Date();

      await addDoc(collection(db, "fechasGuardadas"), {
        carnet,
        nombre,
        apellido,
        club,
        condicion,
        categoria,
        numeroCamiseta,
        numeroFecha,
        usuario: usuarioActual,
        fechaGuardado: fechaGuardado.toISOString(),
      });

      Swal.fire({
        title: "Datos guardados correctamente",
        text: `Jugador: ${nombre} ${apellido}, Fecha: ${numeroFecha}`,
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
      setNumeroFecha("");
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

  return (
    <div className="div-carga">
      <form onSubmit={guardarDatos} className="form-container">
        <h3 className="form-title">Carga de Jugadores</h3>

        <div className="form-group">
          <label htmlFor="numeroFecha" className="form-label">
            Nº de Fecha a jugar
          </label>
          <input
            id="numeroFecha"
            className="form-input"
            type="number"
            value={numeroFecha}
            onChange={(e) => setNumeroFecha(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="carnet" className="form-label">
            Nº de carnet
          </label>
          <input
            id="carnet"
            className="form-ncarnet"
            type="number"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
          />
        </div>

        <button type="button" className="buscar-button" onClick={buscarJugador}>
          Buscar Jugador
        </button>

        {jugadorEncontrado && (
          <>
            <div className="habilitado-group">
              <p>Nombre:</p>
              <input
                className="form-jugador"
                type="text"
                placeholder="Nombre"
                value={nombre}
                disabled
              />
            </div>
            <div className="habilitado-group">
              <p>Apellido:</p>
              <input
                className="form-jugador"
                type="text"
                placeholder="Apellido"
                value={apellido}
                disabled
              />
            </div>

            <div className="habilitado-group">
              <p>Club:</p>
              <input
                className="form-jugador"
                type="text"
                placeholder="Club"
                value={club}
                disabled
              />
            </div>
            <div className="habilitado-group">
              <p>Categoria:</p>
              <input
                className="form-jugador"
                type="text"
                placeholder="Categoría"
                value={categoria}
                disabled
              />
            </div>

            <div className="habilitado-group">
              <p>Habilitado:</p>
              <input
                className="form-jugador"
                type="text"
                placeholder="Condición"
                value={condicion}
                disabled
              />
            </div>

            <div className="habilitado-group">
              <p>Nº Camiseta:</p>
              <input
                className="form-camiseta"
                type="number"
                value={numeroCamiseta}
                onChange={(e) => setNumeroCamiseta(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="agregar-button">
          Guardar
        </button>
      </form>
    </div>
  );
}

export default CargaJugadores;
