//import { CartWidget } from "../../common/cartwidget/CartWidget";
//import "./navbar.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <div className="container">
        <Link to="/" className="container-navbar">
          <img
            className="imagen-logo"
            src="https://res.cloudinary.com/di378vek5/image/upload/v1728056110/WhatsApp_Image_2024-09-27_at_20.27.09_vrgph6.jpg"
            alt="Logo"
          />
        </Link>

        <h1 className="container-h1">Cotillon Amelia</h1>

        {/* <CartWidget className="cart-widget" /> */}
      </div>

      <div className="container-navbar-navbar">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/ListarJugadores">Juguetes Nenas</Link>
          </li>
          <li>
            <Link to="/category/Peluches">Peluches</Link>
          </li>
          <li>
            <Link to="/category/Didacticos">Didacticos</Link>
          </li>
          <li>
            <Link to="/category/Autos-Camiones">Autos y Camiones</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
