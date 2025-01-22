import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function BuscarModificarJugadores() {
  const [carnet, setCarnet] = useState("");
  const [jugador, setJugador] = useState(null);
  const [condicion, setCondicion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para buscar jugador por carnet
  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(
        collection(db, "jugadores"),
        where("carnet", "==", carnet)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          title: "Jugador no encontrado",
          text: "No se encontró ningún jugador con ese carnet.",
          icon: "error",
        });
        setJugador(null);
      } else {
        const jugadorData = querySnapshot.docs[0];
        setJugador({ id: jugadorData.id, ...jugadorData.data() });
        setCondicion(jugadorData.data().habilitado ? "true" : "false");
      }
    } catch (error) {
      console.error("Error al buscar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al buscar el jugador.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la condición del jugador
  const handleModificar = async () => {
    if (!jugador) return;

    try {
      const jugadorRef = doc(db, "jugadores", jugador.id);
      const nuevoEstado = condicion === "true"; // Convertir de string a booleano
      await updateDoc(jugadorRef, { habilitado: nuevoEstado });

      // Actualizar el estado del jugador
      setJugador((prevJugador) => ({
        ...prevJugador,
        habilitado: nuevoEstado,
      }));

      Swal.fire({
        title: "Jugador actualizado",
        text: `El jugador ha sido ${
          nuevoEstado ? "habilitado" : "inhabilitado"
        } exitosamente.`,
        icon: "success",
      });

      setCondicion("");
    } catch (error) {
      console.error("Error al actualizar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el jugador.",
        icon: "error",
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Buscar y Modificar Jugador</h1>
      <form className="form" onSubmit={handleBuscar}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            className="inputs"
            type="text"
            placeholder="Nº de carnet"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="buscar-button" disabled={loading}>
            {loading ? "Buscando..." : "Buscar Jugador"}
          </button>
        </div>
      </form>

      {jugador && (
        <div className="jugador-info">
          <h3>Información del jugador:</h3>
          <p>
            <strong>Nombre:</strong> {jugador.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {jugador.apellido}
          </p>
          <p>
            <strong>Club:</strong> {jugador.club}
          </p>
          <p>
            <strong>Condición:</strong>{" "}
            {jugador.habilitado ? "Habilitado" : "Inhabilitado"}
          </p>
          <div className="modificar-container">
            <label>
              <strong>Modificar condición:</strong>
            </label>
            <select
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              className="select-condicion"
              disabled={loading}
            >
              <option value="true">Habilitado</option>
              <option value="false">Inhabilitado</option>
            </select>
            <button
              onClick={handleModificar}
              className="modificar-button"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="volver-button"
                onClick={() => navigate("/admin-dashboard")}
                disabled={loading}
              >
                Volver al Panel de Administrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscarModificarJugadores;
