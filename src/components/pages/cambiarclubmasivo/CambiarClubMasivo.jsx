import { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CambiarClubMasivo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Leer archivo Excel y convertirlo a JSON
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Filtrar datos correctos
      const formattedData = parsedData
        .map((item) => ({
          dni: String(item["DNI"] || "").trim(),
          nuevoClub: String(item["Nuevo Club"] || "").trim(),
        }))
        .filter((item) => item.dni && item.nuevoClub); // Filtra filas sin datos

      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  // Subir cambios a Firebase
  const uploadToFirebase = async () => {
    if (data.length === 0) {
      alert("No hay datos para subir.");
      return;
    }

    setLoading(true);

    try {
      const jugadoresRef = collection(db, "jugadores");

      for (const item of data) {
        const q = query(jugadoresRef, where("dni", "==", item.dni));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const jugadorDoc = querySnapshot.docs[0].ref;
          const jugadorData = querySnapshot.docs[0].data();

          // Guardar el club anterior
          const clubAnterior = jugadorData.club || "Desconocido";

          await updateDoc(jugadorDoc, {
            clubAnterior: clubAnterior,
            club: item.nuevoClub,
          });
        }
      }

      Swal.fire(
        "Actualización completa",
        "Los clubes fueron cambiados.",
        "success"
      );
      setData([]);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudieron actualizar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };
  // Exportar lista de clubes a Excel
  const exportarClubes = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const snapshot = await getDocs(jugadoresRef);

      const clubes = new Set();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.club) {
          clubes.add(data.club);
        }
      });

      const clubesArray = Array.from(clubes).map((club) => ({ Club: club }));

      // Crear y descargar el archivo Excel
      const ws = XLSX.utils.json_to_sheet(clubesArray);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clubes");
      XLSX.writeFile(wb, "Lista_Clubes.xlsx");

      Swal.fire(
        "Exportado",
        "La lista de clubes ha sido descargada.",
        "success"
      );
    } catch (error) {
      console.error("Error al exportar clubes:", error);
      Swal.fire("Error", "No se pudo exportar la lista de clubes.", "error");
    }
  };
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center mb-4">
        Cambiar Club de Jugadores
      </h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 p-2 border rounded w-full"
      />

      {data.length > 0 && (
        <div className="overflow-auto max-h-64 border p-2 rounded bg-gray-100">
          <h2 className="font-semibold mb-2">Vista Previa:</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">DNI</th>
                <th className="border px-2 py-1">Nuevo Club</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border">
                  <td className="border px-2 py-1">{row.dni}</td>
                  <td className="border px-2 py-1">{row.nuevoClub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={uploadToFirebase}
        disabled={loading || data.length === 0}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Actualizando..." : "Actualizar en Firebase"}
      </button>
      <div>
        <button
          onClick={exportarClubes}
          className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Exportar Clubes a Excel
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
};

export default CambiarClubMasivo;
