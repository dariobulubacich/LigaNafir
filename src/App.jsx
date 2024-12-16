import { BrowserRouter, Route, Routes } from "react-router-dom";
//import Auth from "./components/pages/auth/Auth";
import CargaJugadores from "./components/pages/cargajugadores/CargaJugadores";
//import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import ProtectedRoute from "./components/protectedroute/ProtectedRoute";
//import ListarJugadores from "./components/pages/listarjugadores/ListarJugadores";
import AgregarJugadores from "./components/pages/agregarjugadores/AgregarJugadores";
import Login from "./components/pages/auth/Auth";
//import { ProtectedLayout } from "./components/layout/proyectedlayout/ProtectedLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/CargaJugadores"
          element={
            <ProtectedRoute role="usuario">
              <CargaJugadores />
            </ProtectedRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/AgregarJugadores" element={<AgregarJugadores />} />
        </Route>
        {/* <Route element={<ProtectedRoute role="administrador" />}>
          <Route path="/CargaJugadores" element={<CargaJugadores />}></Route> */}
        {/* <AgregarJugadores /> */}
        {/* <AdminDashboard /> */}
        {/* </Route> */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
