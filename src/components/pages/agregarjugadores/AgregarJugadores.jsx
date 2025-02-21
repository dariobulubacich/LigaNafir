import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../../../firebase"; // Importar Firebase
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./agregarjugadores.css";

function AgregarJugadores() {
  const [dni, setDni] = useState("");
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [club, setClub] = useState("");
  const [clubes, setClubes] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [condicion, setCondicion] = useState("");
  const [habilitado, setHabilitado] = useState("true");
  const [esJugadorExistente, setEsJugadorExistente] = useState(false);
  const navigate = useNavigate();

  // ✅ Obtener usuario autenticado
  useEffect(() => {
    const currentUser = auth.currentUser;
    setUsuario(currentUser ? currentUser.email : "No autenticado");
  }, []);

  // ✅ Buscar jugador por DNI y asignar datos si existe
  const handleCheckDni = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("dni", "==", dni));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const jugador = querySnapshot.docs[0].data();
        setCarnet(jugador.carnet);
        setNombre(jugador.nombre);
        setApellido(jugador.apellido);
        setDomicilio(jugador.domicilio);
        setTelefono(jugador.telefono);
        setFechaNacimiento(jugador.fechaNacimiento);
        setCategoria(jugador.categoria);
        setClub(jugador.club);
        setUsuario(jugador.usuario);
        setFechaAlta(jugador.fechaAlta);
        setCiudad(jugador.ciudad);
        setObservaciones(jugador.observaciones);
        setCondicion(jugador.condicion);
        setHabilitado(jugador.habilitado ? "true" : "false");
        setEsJugadorExistente(true);
        Swal.fire(
          "Jugador ya registrado",
          "Los datos fueron cargados.",
          "info"
        );
      } else {
        const lastCarnetQuery = query(
          jugadoresRef,
          orderBy("carnet", "desc"),
          limit(1)
        );
        const lastCarnetSnapshot = await getDocs(lastCarnetQuery);
        const lastCarnetNumber = lastCarnetSnapshot.empty
          ? 0
          : parseInt(lastCarnetSnapshot.docs[0].data().carnet, 10);
        setCarnet((lastCarnetNumber + 1).toString());
        Swal.fire(
          "Jugador no registrado",
          `Se asignó el carnet ${lastCarnetNumber + 1}.`,
          "success"
        );
        setEsJugadorExistente(false);
      }
    } catch (error) {
      console.error("Error al verificar el jugador:", error);
      Swal.fire("Error", "Hubo un problema al verificar el jugador.", "error");
    }
  };

  useEffect(() => {
    const fetchClubes = async () => {
      const clubesRef = collection(db, "clubes");
      const clubesSnapshot = await getDocs(clubesRef);
      const clubesList = clubesSnapshot.docs.map((doc) => doc.data().nombre);
      setClubes(clubesList);
    };
    fetchClubes();
  }, []);

  useEffect(() => {
    if (fechaNacimiento) {
      const year = new Date(fechaNacimiento).getFullYear();
      setCategoria(year.toString());
    }
  }, [fechaNacimiento]);

  const capitalizarTexto = (texto) => {
    return texto.toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());
  };

  // ✅ Guardar o actualizar jugador en Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("dni", "==", dni));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 🔹 **Actualizar jugador existente**
        const jugadorDoc = querySnapshot.docs[0].ref;
        await updateDoc(jugadorDoc, {
          carnet,
          nombre,
          apellido,
          domicilio,
          telefono,
          fechaNacimiento,
          categoria,
          club,
          usuario,
          fechaAlta,
          ciudad,
          observaciones,
          condicion,
          habilitado: habilitado === "true",
        });
        Swal.fire("Jugador actualizado exitosamente", "", "success");
      } else {
        // 🔹 **Crear nuevo jugador**
        const nuevoJugadorRef = doc(collection(db, "jugadores"));
        await setDoc(nuevoJugadorRef, {
          dni,
          carnet,
          nombre,
          apellido,
          domicilio,
          telefono,
          fechaNacimiento,
          categoria,
          club,
          usuario,
          fechaAlta,
          ciudad,
          observaciones,
          condicion,
          habilitado: habilitado === "true",
        });
        Swal.fire("Jugador agregado exitosamente", "", "success");
      }

      // ✅ Limpiar formulario
      setDni("");
      setCarnet("");
      setNombre("");
      setApellido("");
      setDomicilio("");
      setTelefono("");
      setFechaNacimiento("");
      setCategoria("");
      setClub("");
      setFechaAlta("");
      setCiudad("");
      setObservaciones("");
      setHabilitado("true");
      setEsJugadorExistente(false);
    } catch (error) {
      console.error("Error al guardar el jugador:", error);
      Swal.fire("Error", "No se pudo guardar el jugador.", "error");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Altas de Jugadores</h1>
      <div className="form-containers">
        <form onSubmit={handleSubmit}>
          <div className="div-dni">
            <input
              className="inputs-dni"
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
            <button type="button" onClick={handleCheckDni} className="buttons">
              Verificar DNI
            </button>

            <h2 className="h2">Nº Carnet:</h2>
            <input
              className="inputs-carnet"
              type="text"
              placeholder="Nº de carnet"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              required
              readOnly
            />
          </div>
          <div className="div-dni">
            <input
              className="inputs"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(capitalizarTexto(e.target.value))}
              required
            />
            <input
              className="inputs"
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(capitalizarTexto(e.target.value))}
              required
            />
          </div>
          <div className="div-dni">
            <input
              className="inputs"
              type="text"
              placeholder="Domicilio"
              value={domicilio}
              readOnly={esJugadorExistente}
              onChange={(e) => setDomicilio(capitalizarTexto(e.target.value))}
              required
            />

            <input
              className="inputs"
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="div-dni">
            <h2 className="h2">Fecha Nacimiento</h2>
            <input
              className="inputs"
              type="date"
              placeholder="Fecha de Nacimiento"
              value={fechaNacimiento}
              readOnly={esJugadorExistente}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
            <input
              className="inputs"
              type="text"
              placeholder="Usuario"
              value={usuario}
              readOnly
              required
            />
          </div>
          <div className="div-dni">
            <input
              type="text"
              placeholder="Categoría"
              value={categoria}
              readOnly
              required
            />
            <select
              value={club}
              onChange={(e) => setClub(e.target.value)}
              required
            >
              <option value="">Seleccione un Club</option>
              {clubes.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>

          <div className="div-dni">
            <h2 className="h2">Fecha de alta</h2>

            <input
              className="inputs"
              type="date"
              placeholder="Fecha de Alta"
              value={fechaAlta}
              readOnly={esJugadorExistente}
              onChange={(e) => setFechaAlta(e.target.value)}
              required
            />
            <input
              className="inputs"
              type="text"
              placeholder="Ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(capitalizarTexto(e.target.value))}
              required
            />
          </div>
          <div className="div-hab">
            <textarea
              className="inputs"
              placeholder="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows="3"
            ></textarea>

            <label>
              <strong>Condición:</strong>
            </label>
            <select
              className="inputs"
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              required
            >
              <option value="">Seleccione una condición</option>
              <option value="Habilitado">Habilitado</option>
              <option value="Inhabilitado">Inhabilitado</option>
            </select>
          </div>

          <div className="div-agre-client">
            <button type="submit" className="buttons">
              Guardar
            </button>
            <button
              className="buttons"
              onClick={() => navigate("/admin-dashboard")}
            >
              Panel de Administrador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarJugadores;
