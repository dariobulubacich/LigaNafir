import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import "./exportfechasexcel.css";
import { useNavigate } from "react-router-dom";

const ExportFechasExcel = () => {
  const [fechas, setFechas] = useState([]);
  const [torneos, setTorneos] = useState({});
  const [filtroTorneo, setFiltroTorneo] = useState("");
  const [filtroNumeroFecha, setFiltroNumeroFecha] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTorneos = async () => {
      const querySnapshot = await getDocs(collection(db, "torneos"));
      const torneosMap = {};
      querySnapshot.forEach((doc) => {
        torneosMap[doc.id] = doc.data().nombre;
      });
      setTorneos(torneosMap);
    };

    const fetchFechas = async () => {
      const querySnapshot = await getDocs(collection(db, "fechasGuardadas"));
      const fechasArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFechas(fechasArray);
    };

    fetchTorneos();
    fetchFechas();
  }, []);

  const fechasFiltradas = fechas.filter(
    (fecha) =>
      (filtroTorneo === "" || fecha.torneo === filtroTorneo) &&
      (filtroNumeroFecha === "" || fecha.numeroFecha === filtroNumeroFecha)
  );

  const extraerAnioDesdeCategoria = (categoria) => {
    if (!categoria) return null;
    console.log(`🟠 Categoria recibida: "${categoria}"`);
    const match = categoria.match(/\d{4}/);
    console.log(`🔵 Año encontrado: ${match ? match[0] : "Ninguno"}`);
    return match ? parseInt(match[0]) : null;
  };

  const obtenerCategoria = (categoria) => {
    const anioNacimiento = extraerAnioDesdeCategoria(categoria);
    if (!anioNacimiento) return ""; // Si no se detecta un año válido, retorna vacío

    if ([2016, 2017, 2018, 2019, 2020].includes(anioNacimiento)) {
      return "Mini";
    } else if ([2014, 2015].includes(anioNacimiento)) {
      return "Sub 09";
    } else if ([2012, 2013].includes(anioNacimiento)) {
      return "Sub 12";
    } else if ([2009, 2010, 2011].includes(anioNacimiento)) {
      return "Sub 15";
    } else if ([2007, 2008].includes(anioNacimiento)) {
      return "Reserva";
    } else if (
      anioNacimiento >= 2006 &&
      anioNacimiento <= new Date().getFullYear() - 34
    ) {
      return "Primera";
    } else if (anioNacimiento < new Date().getFullYear() - 34) {
      return "Veteranas";
    } else {
      return ""; // Si no encaja en ninguna categoría
    }
  };

  const exportToExcel = () => {
    const fechasConNombreTorneo = fechasFiltradas.map((fecha) => {
      const categoriaExtra = obtenerCategoria(fecha.categoria); // Ahora se obtiene siempre

      console.log(
        `Categoria: ${fecha.categoria} → CategoriaExtra: ${categoriaExtra}`
      ); // Log para verificar los datos

      return {
        carnet: fecha.carnet || "",
        apellido: fecha.apellido || "",
        nombre: fecha.nombre || "",
        categoria: fecha.categoria || "",
        categoriaExtra, // Nueva columna con la categoría asignada
        club: fecha.club || "",
        numeroCamiseta: fecha.numeroCamiseta || "",
        tipoJugador: fecha.tipoJugador || "",
        condicion: fecha.condicion || "",
        fechaGuardado: fecha.fechaGuardado || "",
        horaGuardado: fecha.horaGuardado || "",
        numeroFecha: fecha.numeroFecha || "",
        observaciones: fecha.observaciones || "",
        torneo: torneos[fecha.torneo] || fecha.torneo,
        usuario: fecha.usuario || "",
      };
    });

    console.log(fechasConNombreTorneo); // Log para verificar la estructura del array antes de exportar

    const worksheet = XLSX.utils.json_to_sheet(fechasConNombreTorneo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fechas");
    XLSX.writeFile(workbook, "fechasGuardadas.xlsx");
  };

  // Función para navegar al AdminDashboard
  const goToExportFechasExcel = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="container-exportf">
      <h2 className="h2-exportf">Listado de Fechas Guardadas</h2>

      <div className="div-exportf">
        <select
          className="select-export"
          value={filtroTorneo}
          onChange={(e) => setFiltroTorneo(e.target.value)}
        >
          <option value="">Todos los Torneos</option>
          {Object.entries(torneos).map(([id, nombre]) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="imput-export"
          placeholder="Número de Fecha"
          value={filtroNumeroFecha}
          onChange={(e) => setFiltroNumeroFecha(e.target.value)}
        />
      </div>

      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
            <th className="th-exportf">Carnet</th>
            <th className="th-exportf">Apellido</th>
            <th className="th-exportf">Nombre</th>
            <th className="th-exportf">Categoría</th>
            <th className="th-exportf">Club</th>
            <th className="th-exportf">N° Camiseta</th>
            <th className="th-exportf">Titular-Suplente</th>
            <th className="th-exportf">Condición</th>
            <th className="th-exportf">Fecha Guardado</th>
            <th className="th-exportf">Hora Guardado</th>
            <th className="th-exportf">N° Fecha</th>
            <th className="th-exportf">Observaciones</th>
            <th className="th-exportf">Torneo</th>
            <th className="th-exportf">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {fechasFiltradas.slice(0, 5).map((fecha) => (
            <tr key={fecha.id} className="border">
              <td className="td-exportf">{fecha.carnet || "-"}</td>
              <td className="td-exportf">{fecha.apellido || "-"}</td>
              <td className="td-exportf">{fecha.nombre || "-"}</td>
              <td className="td-exportf">{fecha.categoria || "-"}</td>
              <td className="td-exportf">{fecha.club || "-"}</td>
              <td className="td-exportf">{fecha.numeroCamiseta || "-"}</td>
              <td className="td-exportf">{fecha.tipoJugador || "-"}</td>
              <td className="td-exportf">{fecha.condicion || "-"}</td>
              <td className="td-exportf">{fecha.fechaGuardado || "-"}</td>
              <td className="td-exportf">{fecha.horaGuardado || "-"}</td>
              <td className="td-exportf">{fecha.numeroFecha || "-"}</td>
              <td className="td-exportf">{fecha.observaciones || "-"}</td>
              <td className="td-exportf">
                {torneos[fecha.torneo] || fecha.torneo}
              </td>
              <td className="td-exportf">{fecha.usuario || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={exportToExcel}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Exportar a Excel
        </button>

        <button className="volver-button" onClick={goToExportFechasExcel}>
          Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
};

export default ExportFechasExcel;
