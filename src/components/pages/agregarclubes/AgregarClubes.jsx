import { useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./agregarclubes.css";

function AgregarClubes() {
  // Estados para los datos del club
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");

  const navigate = useNavigate();
  const clubesRef = collection(db, "clubes");

  // Función para verificar si el club ya existe
  const verificarClub = async () => {
    try {
      const q = query(clubesRef, where("nombre", "==", nombre));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Swal.fire({
          title: "Club ya registrado",
          text: "Este club ya existe en la base de datos.",
          icon: "info",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar el club:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al verificar el club.",
        icon: "error",
      });
      return false;
    }
  };

  // Función para agregar un club a Firebase
  const agregarClub = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire("Error", "El nombre del club es obligatorio.", "error");
      return;
    }

    const clubExiste = await verificarClub();
    if (!clubExiste) return;

    try {
      await addDoc(clubesRef, {
        numero,
        nombre,
        domicilio,
        telefono,
        observaciones,
        fechaAlta,
      });

      Swal.fire("Éxito", "Club agregado correctamente.", "success");

      // Resetear los campos del formulario
      setNumero("");
      setNombre("");
      setDomicilio("");
      setTelefono("");
      setObservaciones("");
      setFechaAlta("");
    } catch (error) {
      console.error("Error al agregar el club:", error);
      Swal.fire("Error", "No se pudo agregar el club.", "error");
    }
  };

  return (
    <div className="form-containers-club">
      <h1 className="title-club">Agregar Club</h1>

      <form className="form-club" onSubmit={agregarClub}>
        <input
          className="inputs-club"
          type="text"
          placeholder="Número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />

        <input
          className="inputs-club"
          type="text"
          placeholder="Nombre del Club"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          className="inputs-club"
          type="text"
          placeholder="Domicilio"
          value={domicilio}
          onChange={(e) => setDomicilio(e.target.value)}
        />

        <input
          className="inputs-club"
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <textarea
          className="inputs-club"
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows="3"
        ></textarea>

        <input
          className="inputs-club"
          type="date"
          value={fechaAlta}
          onChange={(e) => setFechaAlta(e.target.value)}
        />

        <div className="buttons-club">
          <button type="submit" className="save-button">
            Guardar Club
          </button>
          <button
            type="button"
            className="back-button-club"
            onClick={() => navigate("/admin-dashboard")}
          >
            Volver al Panel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgregarClubes;
