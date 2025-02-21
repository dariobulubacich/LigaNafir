import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ajusta la ruta según tu estructura
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./altatorneos.css";

const AltaTorneos = () => {
  const [nombreTorneo, setNombreTorneo] = useState("");
  const navigate = useNavigate();

  const handleGuardarTorneo = async () => {
    if (!nombreTorneo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Debes ingresar un nombre para el torneo.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "torneos"), { nombre: nombreTorneo });
      Swal.fire({
        icon: "success",
        title: "Torneo Guardado",
        text: `El torneo "${nombreTorneo}" fue agregado exitosamente.`,
      });
      setNombreTorneo(""); // Limpia el campo después de guardar
    } catch (error) {
      console.error("Error al guardar torneo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el torneo. Inténtalo nuevamente.",
      });
    }
  };
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="alta-torneos">
      <h2>Dar de Alta Torneo</h2>
      <input
        className="input"
        type="text"
        placeholder="Nombre del Torneo"
        value={nombreTorneo}
        onChange={(e) => setNombreTorneo(e.target.value)}
      />
      <button className="button" onClick={handleGuardarTorneo}>
        Guardar Torneo
      </button>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
};

export default AltaTorneos;
