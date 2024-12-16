import "./admindashboard.css";
const AdminDashboard = () => {
  return (
    <div>
      <h1>Bienvenido al panel de administrador</h1>
      <div>
        <nav>
          <ul className="ul-nav">
            <li>
              <a href="/agregarjugadores">Agregar Jugadores</a>
            </li>
            <li>
              <a href="/listarjugadores">Listar Jugadores</a>
            </li>
            <li>
              <a href="/cargajugadores">Carga Jugadores</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
