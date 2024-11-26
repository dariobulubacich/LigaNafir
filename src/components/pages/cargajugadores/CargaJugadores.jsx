import { useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";

function CargaJugadores() {
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");
  const [jugadorEncontrado, setJugadorEncontrado] = useState(null);

  const buscarJugador = async () => {
    try {
      // Crear una consulta para buscar por el campo "carnet"
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("carnet", "==", carnet));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const jugador = querySnapshot.docs[0]; // Tomar el primer resultado
        const data = jugador.data();

        setJugadorEncontrado({ id: jugador.id, ...data });
        setNombre(data.nombre);
        setApellido(data.apellido);
        setClub(data.club);
        setCategoria(data.categoria);

        // Swal.fire({
        //   title: "Jugador encontrado",
        //   text: `Nombre: ${data.nombre} ${data.apellido}`,
        //   icon: "success",
        //});
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

  // Guardar número de camiseta en nueva colección
  const guardarNumeroCamiseta = async (e) => {
    e.preventDefault();
    if (!jugadorEncontrado) {
      Swal.fire({
        title: "Error",
        text: "Busca un jugador antes de asignar el número de camiseta.",
        icon: "error",
      });
      return;
    }

    try {
      await addDoc(collection(db, "camisetasAsignadas"), {
        carnet,
        nombre,
        apellido,
        club,
        categoria,
        numeroCamiseta,
      });

      Swal.fire({
        title: "Número de camiseta asignado",
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
      console.error("Error al guardar el número de camiseta: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el número de camiseta.",
        icon: "error",
      });
    }
  };

  return (
    <Grid container={true}>
      <Grid size={{ xs: 10 }} textAlign={"center"}>
        <form className="form" onSubmit={guardarNumeroCamiseta}>
          <div className="form-containers">
            <Grid container={true}>
              <Grid
                size={{ xs: 12 }}
                textAlign={"center"}
                padding={"0.5rem"}
                fontSize={"3rem"}
                color={"white"}
              >
                <div>
                  <h3>Ingrese numero Carnet</h3>
                </div>
              </Grid>
            </Grid>
            <div>
              <input
                style={{
                  padding: "2rem",
                  fontSize: "2.5rem",
                  width: "15%",
                  textAlign: "center",
                }}
                className="inputs"
                type="text"
                placeholder=""
                value={carnet}
                onChange={(e) => setCarnet(e.target.value)}
                required
              />
            </div>
            <Grid container={true}>
              <Grid size={{ xs: 12 }} textAlign={"center"} padding={"1.5rem"}>
                <div>
                  <button
                    style={{
                      padding: "0.5rem",
                      color: "white",
                      textDecoration: "white",
                      background: "black",
                      border: "none",
                      cursor: "pointer",
                    }}
                    type="button"
                    className="buscar-button"
                    onClick={buscarJugador}
                  >
                    Buscar Jugador
                  </button>
                </div>
              </Grid>
            </Grid>

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
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    width: "10%",
                  }}
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
            <button
              style={{ padding: "0.5rem", fontSize: "1rem", width: "10%" }}
              type="submit"
              className="agregar-button"
            >
              Guardar
            </button>
          </div>
        </form>
      </Grid>
    </Grid>
  );
}

export default CargaJugadores;
