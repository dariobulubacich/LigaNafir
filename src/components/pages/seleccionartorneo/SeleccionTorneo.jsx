import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ajusta la ruta según tu estructura
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SeleccionTorneo = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");
  const [numeroIngresado, setNumeroIngresado] = useState("");
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

  const handleSeleccionar = async () => {
    if (!torneoSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un torneo",
        text: "Debes elegir un torneo antes de continuar.",
      });
      return;
    }

    if (!numeroIngresado) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa un número",
        text: "Debes ingresar un número antes de continuar.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "numeroFecha"), {
        torneoId: torneoSeleccionado,
        numero: numeroIngresado,
      });

      localStorage.setItem("torneoSeleccionado", torneoSeleccionado);
      localStorage.setItem("numeroIngresado", numeroIngresado);
      navigate("/cargajugadores", { state: { numeroFecha: numeroIngresado } }); // Redirige con númeroFecha
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar la información.",
      });
    }
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
      <input
        type="number"
        className="input"
        placeholder="Ingresa un número"
        value={numeroIngresado}
        onChange={(e) => setNumeroIngresado(e.target.value)}
      />
      <button className="button" onClick={handleSeleccionar}>
        Confirmar Torneo
      </button>
    </div>
  );
};

export default SeleccionTorneo;
