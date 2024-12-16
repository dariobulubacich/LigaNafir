import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AgregarJugadores() {
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");

  const navigate = useNavigate();

  // Función para enviar los datos a Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Agregar datos a la colección "jugadores"
      await addDoc(collection(db, "jugadores"), {
        carnet,
        nombre,
        apellido,
        club,
        categoria,
        numeroCamiseta,
      });
      Swal.fire({
        title: "Jugador agregado exitosamente",
        text: "",
        icon: "success",
      });

      // Limpiar los campos del formulario
      setCarnet("");
      setNombre("");
      setApellido("");
      setClub("");
      setCategoria("");
      setNumeroCamiseta("");
    } catch (error) {
      console.error("Error al agregar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo agregar el jugador.",
        icon: "error",
      });
    }
  };

  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-containers">
          <input
            className="inputs"
            type="text"
            placeholder="Nº de carnet"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Club"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="number"
            placeholder="Número de camiseta (opcional)"
            value={numeroCamiseta}
            onChange={(e) => setNumeroCamiseta(e.target.value)}
          />
        </div>
        <div className="div-agre-client">
          <button type="submit" className="agregar-button">
            Agregar Jugador
          </button>
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Administrador
        </button>
      </div>
    </div>
  );
}

export default AgregarJugadores;
