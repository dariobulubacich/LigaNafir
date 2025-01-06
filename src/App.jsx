import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/pages/auth/Auth";
import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import AgregarJugadores from "./components/pages/agregarjugadores/AgregarJugadores";
import CargaJugadores from "./components/pages/cargajugadores/CargaJugadores";
import ListarJugadores from "./components/pages/listados/ListarJugadores";
import Carnets from "./components/pages/carnets/Carnets";
import BuscarModificarJugadores from "./components/pages/buscarjugadores/BuscarJugadores";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Agregarjugadores" element={<AgregarJugadores />} />{" "}
        <Route path="/CargaJugadores" element={<CargaJugadores />} />{" "}
        <Route path="/ListarJugadores" element={<ListarJugadores />} />{" "}
        <Route path="/Carnets" element={<Carnets />} />{" "}
        <Route path="/BuscarJugadores" element={<BuscarModificarJugadores />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
