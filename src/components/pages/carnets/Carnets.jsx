import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const Carnets = () => {
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const carnetRef = useRef();
  const navigate = useNavigate();

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

  // Función para imprimir
  const handlePrint = () => {
    const printContents = carnetRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
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
          Volver al Panel de Admini
        </button>
      </div>

      {/* Carnet generado */}
      {playerData && (
        <div>
          <div
            ref={carnetRef}
            style={{
              width: "20cm",
              height: "10cm",
              border: "2px solid #000",
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#f9f9f9",
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: 0 }}>Carnet de Jugador</h2>
            </div>
            <div>
              <p>
                <strong>Apellido:</strong> {playerData.apellido}
              </p>
              <p>
                <strong>Nombre:</strong> {playerData.nombre}
              </p>
              <p>
                <strong>Club:</strong> {playerData.club}
              </p>
              <p>
                <strong>Categoría:</strong> {playerData.categoria}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <QRCodeCanvas
                value={JSON.stringify({
                  apellido: playerData.apellido,
                  nombre: playerData.nombre,
                  club: playerData.club,
                  categoria: playerData.categoria,
                })}
                size={80}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
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
