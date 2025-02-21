import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import "./carnet.css";
import "./print.css"; // Importar estilos de impresión

const Carnets = () => {
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const carnetRef = useRef();
  const navigate = useNavigate();

  const formatDate = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    // Verificar si es una cadena en formato DD/MM/YYYY
    const regexFecha = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = fecha.match(regexFecha);

    if (match) {
      const dia = match[1];
      const mes = match[2];
      const anio = match[3];

      const date = new Date(`${anio}-${mes}-${dia}`); // Formato correcto para Date

      return isNaN(date.getTime())
        ? "Fecha inválida"
        : date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    }

    return "Fecha inválida";
  };

  // Función para buscar en Firebase
  const handleSearch = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where(searchField, "==", searchValue));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setPlayerData(data);
      } else {
        alert("No se encontraron jugadores con ese criterio.");
        setPlayerData(null);
      }
    } catch (error) {
      console.error("Error al buscar jugador:", error);
      alert("Hubo un error al buscar el jugador.");
    }
  };

  // Función para imprimir con CSS
  const handlePrint = () => {
    window.print();
  };

  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* Formulario de búsqueda */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="">Seleccionar campo de búsqueda</option>
          <option value="dni">DNI</option>
          <option value="carnet">Nº de Carnet</option>
        </select>
        <input
          type="text"
          placeholder="Ingrese valor de búsqueda"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admin
        </button>
      </div>

      {/* Carnet generado */}
      {playerData && (
        <div>
          <div id="carnet-print" className="carnet-container" ref={carnetRef}>
            <div style={{ textAlign: "center" }}>
              <h2 className="h2-carnet">
                NUEVA ASOCIACION FUTBOL INFANTIL ROSARIO
              </h2>
            </div>
            <div className="carnet-content">
              <div className="fot-qr-container">
                {/* Recuadro para la foto */}
                <div className="foto-container"></div>
                <div className="qr-container">
                  <QRCodeCanvas
                    value={JSON.stringify({
                      carnet: playerData.carnet,
                      nombre: playerData.nombre,
                      apellido: playerData.apellido,
                      fechaNacimiento: playerData.fechaNacimiento,
                      categoria: playerData.categoria,
                      dni: playerData.dni,
                      club: playerData.club,
                    })}
                    size={80}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
              </div>
              {/* Datos del jugador */}
              <div className="datos-container">
                <p>
                  <strong>Nº Carnet:</strong> {playerData.carnet}
                </p>
                <p>
                  <strong>Nombre:</strong> {playerData.nombre}
                </p>
                <p>
                  <strong>Apellido:</strong> {playerData.apellido}
                </p>
                <p>
                  <strong>Fecha Nac:</strong>{" "}
                  {formatDate(playerData.fechaNacimiento)}
                </p>
                <p>
                  <strong>Categoría:</strong> {playerData.categoria}
                </p>
                <p>
                  <strong>D.N.I Nº:</strong> {playerData.dni}
                </p>
                <p>
                  <strong>Club:</strong> {playerData.club}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Imprimir Carnet
          </button>
        </div>
      )}
    </div>
  );
};

export default Carnets;
