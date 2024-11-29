import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedLayout } from "./components/layout/proyectedlayout/ProtectedLayout";
import CargaJugadores from "./components/pages/cargajugadores/CargaJugadores";
import Auth from "./components/pages/auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/CargaJugadores" element={<CargaJugadores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
