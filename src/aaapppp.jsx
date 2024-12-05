import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedLayout } from "./components/layout/proyectedlayout/ProtectedLayout";
import CargaJugadores from "./components/pages/cargajugadores/CargaJugadores";
import AgregarJugadores from "./components/pages/agregarjugadores/AgregarJugadores";
import Auth from "./components/pages/auth/Auth";
import ListarJugadores from "./components/pages/listarjugadores/ListarJugadores";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/CargaJugadores" element={<CargaJugadores />} />
          <Route path="/AgregarJugadores" element={<AgregarJugadores />} />
          <Route path="/ListarJugadores" element={<ListarJugadores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
