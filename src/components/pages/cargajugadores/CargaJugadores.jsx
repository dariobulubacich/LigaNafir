import { useState } from "react";
import { db } from "../../../firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

function CargaJugadores() {
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");
  const [jugadorEncontrado, setJugadorEncontrado] = useState(null);

  // Buscar jugador por carnet
  const buscarJugador = async () => {
    try {
      const jugadorRef = doc(collection(db, "jugadores"), carnet);
      const jugadorSnap = await getDoc(jugadorRef);

      if (jugadorSnap.exists()) {
        const data = jugadorSnap.data();
        setJugadorEncontrado({ id: jugadorSnap.id, ...data });
        setNombre(data.nombre);
        setApellido(data.apellido);
        setClub(data.club);
        setCategoria(data.categoria);
        Swal.fire({
          title: "Jugador encontrado",
          text: `Nombre: ${data.nombre} ${data.apellido}`,
          icon: "success",
        });
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
    }
  };

  // Actualizar el número de camiseta
  const actualizarNumeroCamiseta = async (e) => {
    e.preventDefault();
    if (!jugadorEncontrado) {
      Swal.fire({
        title: "Error",
        text: "Busca un jugador antes de actualizar.",
        icon: "error",
      });
      return;
    }

    try {
      const jugadorRef = doc(db, "jugadores", jugadorEncontrado.id);
      await updateDoc(jugadorRef, { numeroCamiseta });

      Swal.fire({
        title: "Número de camiseta actualizado",
        text: `Jugador: ${nombre} ${apellido}, Número: ${numeroCamiseta}`,
        icon: "success",
      });

      // Limpiar formulario
      setCarnet("");
      setNombre("");
      setApellido("");
      setClub("");
      setCategoria("");
      setNumeroCamiseta("");
      setJugadorEncontrado(null);
    } catch (error) {
      console.error("Error al actualizar el número de camiseta: ", error);
    }
  };

  return (
    <form className="form" onSubmit={actualizarNumeroCamiseta}>
      <div className="form-containers">
        <input
          className="inputs"
          type="text"
          placeholder="Nº de carnet"
          value={carnet}
          onChange={(e) => setCarnet(e.target.value)}
          required
        />
        <button type="button" className="buscar-button" onClick={buscarJugador}>
          Buscar Jugador
        </button>
        {jugadorEncontrado && (
          <>
            <input
              className="inputs"
              type="text"
              placeholder="Nombre"
              value={nombre}
              disabled
            />
            <input
              className="inputs"
              type="text"
              placeholder="Apellido"
              value={apellido}
              disabled
            />
            <input
              className="inputs"
              type="text"
              placeholder="Club"
              value={club}
              disabled
            />
            <input
              className="inputs"
              type="text"
              placeholder="Categoría"
              value={categoria}
              disabled
            />
            <input
              className="inputs"
              type="number"
              placeholder="Número de camiseta"
              value={numeroCamiseta}
              onChange={(e) => setNumeroCamiseta(e.target.value)}
              required
            />
          </>
        )}
      </div>
      <div className="div-agre-client">
        <button type="submit" className="agregar-button">
          Actualizar Número de Camiseta
        </button>
      </div>
    </form>
  );
}

export default CargaJugadores;
