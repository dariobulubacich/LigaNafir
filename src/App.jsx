import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/pages/auth/Auth";
import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import AgregarJugadores from "./components/pages/agregarjugadores/AgregarJugadores";
import CargaJugadores from "./components/pages/cargajugadores/CargaJugadores";
import ListarJugadores from "./components/pages/listados/ListarJugadores";
import Carnets from "./components/pages/carnets/Carnets";
import BuscarModificarJugadores from "./components/pages/buscarjugadores/BuscarJugadores";
import RegisterUser from "./components/pages/registeruser/RegisterUser";
import ImportarExcel from "../src/components/pages/importarexcel/ImportarExcel";
import AgregarClubes from "./components/pages/agregarclubes/AgregarClubes";
import AltaTorneos from "./components/pages/altastorneos/AltaTorneos";
import ListaClubes from "./components/pages/listaclubes/ListaClubes";
import ListadosGenerales from "./components/pages/listadosgenerales/ListadosGenerales";
import Altas from "./components/pages/altas/Altas";
import PorcentajeJuego from "./components/pages/porcentajejuego/PorcentajeJuego";
import FiltrosFechasGuardadas from "./components/pages/tribunaldisciplina/FiltrosFechasGuardadas";
import CambiarClubMasivo from "./components/pages/cambiarclubmasivo/CambiarClubMasivo";
import GestionCategorias from "./components/pages/gestioncategorias/GestionCategorias";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Agregarjugadores" element={<AgregarJugadores />} />{" "}
        <Route path="/AgregarClubes" element={<AgregarClubes />} />{" "}
        <Route path="/CargaJugadores" element={<CargaJugadores />} />{" "}
        <Route path="/ListarJugadores" element={<ListarJugadores />} />{" "}
        <Route path="/Carnets" element={<Carnets />} />{" "}
        <Route path="/BuscarJugadores" element={<BuscarModificarJugadores />} />{" "}
        <Route path="/ImportarExcel" element={<ImportarExcel />} />{" "}
        <Route path="/RegisterUser" element={<RegisterUser />} />{" "}
        <Route path="/AltaTorneos" element={<AltaTorneos />} />{" "}
        <Route path="/ListaClubes" element={<ListaClubes />} />{" "}
        <Route path="/ListadosGenerales" element={<ListadosGenerales />} />{" "}
        <Route path="/Altas" element={<Altas />} />{" "}
        <Route path="/PorcentajeJuego" element={<PorcentajeJuego />} />{" "}
        <Route path="/CambiarClubMasivo" element={<CambiarClubMasivo />} />{" "}
        <Route path="/GestionCategorias" element={<GestionCategorias />} />{" "}
        <Route
          path="/FiltrosFechasGuardadas"
          element={<FiltrosFechasGuardadas />}
        />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
