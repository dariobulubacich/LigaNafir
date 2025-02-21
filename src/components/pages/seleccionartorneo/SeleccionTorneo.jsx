import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Ajusta la ruta según tu estructura
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SeleccionTorneo = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");
  const navigate = useNavigate();

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

  const handleSeleccionar = () => {
    if (!torneoSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un torneo",
        text: "Debes elegir un torneo antes de continuar.",
      });
      return;
    }

    localStorage.setItem("torneoSeleccionado", torneoSeleccionado);
    navigate("/cargajugadores"); // Redirige a la página de carga de jugadores
  };

  return (
    <div className="seleccion-torneo">
      <h2>Selecciona un Torneo</h2>
      <select
        className="input"
        value={torneoSeleccionado}
        onChange={(e) => setTorneoSeleccionado(e.target.value)}
      >
        <option value="">-- Selecciona un torneo --</option>
        {torneos.map((torneo) => (
          <option key={torneo.id} value={torneo.id}>
            {torneo.nombre}
          </option>
        ))}
      </select>
      <button className="button" onClick={handleSeleccionar}>
        Confirmar Torneo
      </button>
    </div>
  );
};

export default SeleccionTorneo;
