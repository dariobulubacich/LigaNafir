import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // Librería para leer Excel
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

  // Obtener el último número registrado
  useEffect(() => {
    const obtenerUltimoNumero = async () => {
      try {
        const querySnapshot = await getDocs(clubesRef);
        let maxNumero = 0;

        querySnapshot.forEach((doc) => {
          const numeroStr = doc.data().numero;
          const numeroInt = parseInt(numeroStr, 10);
          if (!isNaN(numeroInt) && numeroInt > maxNumero) {
            maxNumero = numeroInt;
          }
        });

        setNumero((maxNumero + 1).toString()); // Siguiente número disponible
      } catch (error) {
        console.error("Error al obtener el último número:", error);
        setNumero("1"); // Si hay error, empezar desde 1
      }
    };

    obtenerUltimoNumero();
  }, []);

  // Función para verificar si el club ya existe
  const verificarClub = async (nombreClub) => {
    try {
      const q = query(clubesRef, where("nombre", "==", nombreClub));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Retorna `true` si el club no existe
    } catch (error) {
      console.error("Error al verificar el club:", error);
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

    const clubDisponible = await verificarClub(nombre);
    if (!clubDisponible) {
      Swal.fire("Error", "El club ya existe en la base de datos.", "error");
      return;
    }

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
      setNombre("");
      setDomicilio("");
      setTelefono("");
      setObservaciones("");
      setFechaAlta("");

      // Obtener el nuevo número para el siguiente club
      const nuevoNumero = (parseInt(numero, 10) + 1).toString();
      setNumero(nuevoNumero);
    } catch (error) {
      console.error("Error al agregar el club:", error);
      Swal.fire("Error", "No se pudo agregar el club.", "error");
    }
  };

  // Función para procesar la carga de un archivo Excel
  // Nuevo estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState(null);

  // Función para manejar la selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Función para procesar la importación cuando se presiona el botón
  const handleImport = async () => {
    if (!selectedFile) {
      Swal.fire("Error", "Selecciona un archivo válido.", "error");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        let numeroActual = parseInt(numero, 10);

        for (const row of jsonData) {
          const nombreClub = row.Nombre || row["Nombre del Club"];
          const domicilioClub = row.Domicilio || "";
          const telefonoClub = row.Teléfono || "";
          const observacionesClub = row.Observaciones || "";
          const fechaAltaClub = row["Fecha Alta"] || "";

          if (!nombreClub) continue; // Evita filas vacías

          const clubDisponible = await verificarClub(nombreClub);
          if (!clubDisponible) continue; // Si ya existe, lo omite

          await addDoc(clubesRef, {
            numero: numeroActual.toString(),
            nombre: nombreClub,
            domicilio: domicilioClub,
            telefono: telefonoClub,
            observaciones: observacionesClub,
            fechaAlta: fechaAltaClub,
          });

          numeroActual++; // Incrementa el número para el siguiente club
        }

        setNumero(numeroActual.toString());
        setSelectedFile(null); // Limpia el estado del archivo después de la importación
        Swal.fire("Éxito", "Clubes importados correctamente.", "success");
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Error al importar clubes:", error);
      Swal.fire("Error", "No se pudo importar el archivo.", "error");
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
          readOnly
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

      {/* Botón para cargar archivo Excel */}
      <div className="import-section">
        <h2>Importar Clubes desde Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileSelect}
          className="file-input"
        />
        <button
          onClick={handleImport}
          className="import-button"
          disabled={!selectedFile}
        >
          Importar
        </button>
      </div>
    </div>
  );
}

export default AgregarClubes;
