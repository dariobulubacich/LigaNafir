import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./gestioncategorias.css";

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState("");
  const [subcategoriasEditadas, setSubcategoriasEditadas] = useState({});
  const [anioCategoria, setAnioCategoria] = useState(""); // Añadido para ingresar el año
  const navigate = useNavigate();

  // Obtener categorías
  useEffect(() => {
    const obtenerCategorias = async () => {
      const querySnapshot = await getDocs(collection(db, "categoriasfemenino"));
      const categoriasData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (!Array.isArray(data.SubCat)) {
          console.warn(
            `La categoría "${data.CatFem}" tiene un SubCat inválido.`,
            data.SubCat
          );
          data.SubCat = [];
        }
        return { id: doc.id, ...data };
      });
      setCategorias(categoriasData);
    };
    obtenerCategorias();
  }, []);

  // Agregar nueva categoría con validación de año
  const agregarCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    const currentYear = new Date().getFullYear();
    let validYear = true;

    // Validar la categoría "Primera" (rango de años)
    if (
      nuevaCategoria === "Primera" &&
      (parseInt(anioCategoria) > currentYear || parseInt(anioCategoria) <= 2006)
    ) {
      validYear = false;
      alert("La categoría 'Primera' debe tener un año desde 2006 hacia abajo.");
    }

    // Validar la categoría "Veteranos" (mayores de 35 años)
    if (nuevaCategoria === "Veteranos") {
      const edad = currentYear - parseInt(anioCategoria);
      if (edad <= 35) {
        validYear = false;
        alert("La categoría 'Veteranos' debe tener más de 35 años.");
      }
    }

    // Solo agregar la categoría si es válida
    if (validYear) {
      const docRef = await addDoc(collection(db, "categoriasfemenino"), {
        CatFem: nuevaCategoria,
        AnioCategoria: anioCategoria, // Guardar el año en el campo
        SubCat: [],
      });
      setCategorias([
        ...categorias,
        {
          id: docRef.id,
          CatFem: nuevaCategoria,
          AnioCategoria: anioCategoria,
          SubCat: [],
        },
      ]);
      setNuevaCategoria("");
      setAnioCategoria(""); // Limpiar el campo de año
    }
  };

  // Agregar subcategoría
  const agregarSubcategoria = async () => {
    if (!categoriaSeleccionada || !nuevaSubcategoria.trim()) return;
    const categoria = categorias.find(
      (cat) => cat.id === categoriaSeleccionada
    );
    const nuevasSubcategorias = [
      ...new Set([...categoria.SubCat, nuevaSubcategoria]),
    ];

    await updateDoc(doc(db, "categoriasfemenino", categoriaSeleccionada), {
      SubCat: nuevasSubcategorias,
    });

    setCategorias(
      categorias.map((cat) =>
        cat.id === categoriaSeleccionada
          ? { ...cat, SubCat: nuevasSubcategorias }
          : cat
      )
    );
    setNuevaSubcategoria("");
  };

  // Eliminar subcategoría
  const eliminarSubcategoria = async (subcat) => {
    const categoria = categorias.find(
      (cat) => cat.id === categoriaSeleccionada
    );
    const nuevasSubcategorias = categoria.SubCat.filter(
      (sub) => sub !== subcat
    );

    await updateDoc(doc(db, "categoriasfemenino", categoriaSeleccionada), {
      SubCat: nuevasSubcategorias,
    });

    setCategorias(
      categorias.map((cat) =>
        cat.id === categoriaSeleccionada
          ? { ...cat, SubCat: nuevasSubcategorias }
          : cat
      )
    );
  };

  // Editar subcategoría
  const editarSubcategoria = (index, nuevoValor) => {
    setSubcategoriasEditadas({
      ...subcategoriasEditadas,
      [index]: nuevoValor,
    });
  };

  // Guardar edición
  const guardarEdicionSubcategoria = async (index) => {
    const categoria = categorias.find(
      (cat) => cat.id === categoriaSeleccionada
    );
    const nuevoValor = subcategoriasEditadas[index];

    if (!nuevoValor || !nuevoValor.trim()) {
      alert("El valor de la subcategoría no puede estar vacío");
      return;
    }

    const nuevasSubcategorias = [...categoria.SubCat];
    nuevasSubcategorias[index] = nuevoValor;

    await updateDoc(doc(db, "categoriasfemenino", categoriaSeleccionada), {
      SubCat: nuevasSubcategorias,
    });

    setCategorias(
      categorias.map((cat) =>
        cat.id === categoriaSeleccionada
          ? { ...cat, SubCat: nuevasSubcategorias }
          : cat
      )
    );

    setSubcategoriasEditadas((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  // Eliminar categoría
  const eliminarCategoria = async () => {
    if (!categoriaSeleccionada) return;
    await deleteDoc(doc(db, "categoriasfemenino", categoriaSeleccionada));
    setCategorias(categorias.filter((cat) => cat.id !== categoriaSeleccionada));
    setCategoriaSeleccionada("");
  };

  const subcategorias = Array.isArray(
    categorias.find((cat) => cat.id === categoriaSeleccionada)?.SubCat
  )
    ? categorias.find((cat) => cat.id === categoriaSeleccionada).SubCat
    : [];

  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="gestion-categorias-container">
      <h1>Gestión de Categorías</h1>

      <div className="categoria-inputs">
        <input
          className="input-field"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
          placeholder="Nueva categoría"
        />
        <input
          className="input-field"
          type="number"
          value={anioCategoria}
          onChange={(e) => setAnioCategoria(e.target.value)}
          placeholder="Año de la categoría"
        />
        <button className="btn" onClick={agregarCategoria}>
          Agregar Categoría
        </button>
      </div>

      <div className="categoria-seleccion">
        <select
          className="select-field"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.CatFem}
            </option>
          ))}
        </select>
        {categoriaSeleccionada && (
          <button className="btn btn-danger" onClick={eliminarCategoria}>
            Eliminar Categoría
          </button>
        )}
      </div>

      {categoriaSeleccionada && (
        <div className="subcategorias-container">
          <h3 className="h3-gestion">Subcategorías:</h3>

          {subcategorias.length > 0 ? (
            <ul className="subcategorias-list">
              {subcategorias.map((sub, index) => (
                <li key={index} className="subcategoria-item">
                  <input
                    className="input-field subcategoria-input"
                    value={
                      subcategoriasEditadas[index] !== undefined
                        ? subcategoriasEditadas[index]
                        : sub
                    }
                    onChange={(e) => editarSubcategoria(index, e.target.value)}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => guardarEdicionSubcategoria(index)}
                  >
                    Guardar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarSubcategoria(sub)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay subcategorías</p>
          )}

          <input
            className="input-field"
            value={nuevaSubcategoria}
            onChange={(e) => setNuevaSubcategoria(e.target.value)}
            placeholder="Nueva subcategoría"
          />
          <button className="btn" onClick={agregarSubcategoria}>
            Agregar Subcategoría
          </button>
        </div>
      )}

      <div className="go-back-container">
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
};

export default GestionCategorias;
