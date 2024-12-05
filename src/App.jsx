import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./components/pages/auth/Auth";
import CargaJugadores from "./components/pages/cargajugadores/CargaJugadores";
import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import ProtectedRoute from "./components/protectedroute/ProtectedRoute";
// import ListarJugadores from "./components/pages/listarjugadores/ListarJugadores";
//import AgregarJugadores from "./components/pages/agregarjugadores/AgregarJugadores";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/CargaJugadores"
          element={
            <ProtectedRoute role="usuario">
              <CargaJugadores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute role="administrador">
              <AdminDashboard />
            </ProtectedRoute>
          }
        ></Route>

        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
