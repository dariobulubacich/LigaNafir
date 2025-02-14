import { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const ImportarExcel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Leer el archivo Excel y convertirlo a JSON
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir a JSON
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Filtrar solo los campos requeridos
      const formattedData = parsedData.map((item) => ({
        apellido: String(item["apellido"] || "").trim(),
        carnet: String(item["carnet"] || "").trim(),
        categoria: String(item["categoria"] || "").trim(),
        club: String(item["club"] || "").trim(),
        condicion: String(item["condicion"] || "").trim(),
        habilitado: String(item["habilitado"] || "false").trim(),
        nombre: String(item["nombre"] || "").trim(),
        numeroCamiseta: String(item["numeroCamiseta"] || "").trim(),
      }));

      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  // Subir los datos a Firebase
  const uploadToFirebase = async () => {
    if (data.length === 0) {
      alert("No hay datos para subir.");
      return;
    }

    setLoading(true);

    try {
      const batch = data.map(async (item) => {
        await addDoc(collection(db, "jugadores"), item);
      });

      await Promise.all(batch);
      alert("Datos subidos correctamente a Firebase!");
      setData([]);
    } catch (error) {
      console.error("Error al subir datos:", error);
      alert("Error al subir los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center mb-4">
        Importar Excel a Firebase
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
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border px-2 py-1">
                      {value}
                    </td>
                  ))}
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
        {loading ? "Subiendo..." : "Subir a Firebase"}
      </button>
    </div>
  );
};

export default ImportarExcel;
