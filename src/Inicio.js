import React, { useState} from "react";
import { Link } from "react-router-dom";

// Componentes para mostrar en el área de contenido
import CrearProducto from "./CrearProducto";
import CrearPantallaTVFD from "./CrearPantallaTVFD";
import CrearTVFD from "./CrearTVFD";
import CrearUsuario from "./CrearUsuario";
import CrearSalidaPro from "./CrearSalidaPro";
import "./css/Inicio.css";

function Inicio() {
  const [activeContent, setActiveContent] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Obtener el nombre del usuario desde localStorage
  const usuarioNombre = localStorage.getItem('usuario'); // Si el backend también pasa el nombre, puedes almacenarlo aquí.
  const user = usuarioNombre || 'Usuario';


  const handleLinkClick = (content) => {
    setActiveContent(content);
  };

  return (
    <div className="container-fluid" style={{ height: "100vh", padding: 0 }}>
      {/* Navbar */}
      <nav className="navbar">
        <button
          className="btn btn-light toggle-sidebar-btn"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          title={isSidebarVisible ? "Ocultar menú" : "Mostrar menú"}
        >
          <i className="bi bi-border-width"></i>
        </button>
        {/* Agregamos la imagen del logo */}
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="d-flex align-items-center ms-auto">
          <span className="me-3">{user}</span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              localStorage.removeItem('token');  // Limpiar el token al cerrar sesión
              localStorage.removeItem('usuario');
              alert("Sesión cerrada");
              window.location.href = '/';  // Redirigir a la página de login
            }}
            title="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </nav>

      <div className="row" style={{ height: "calc(100vh - 66px)", margin: 0 }}>
        {/* Sidebar */}
        {isSidebarVisible && (
          <div className={`sidebar ${isSidebarVisible ? "show" : ""}`}>
            <ul className="menu">
              <li>
                <Link to="#" onClick={() => handleLinkClick("producto")}>
                  <i className="bi bi-box-arrow-in-up-left"></i> Producto en Proceso
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => handleLinkClick("salidaPro")}>
                  <i className="bi bi-box-arrow-up-left"></i> Salida de Producto
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => handleLinkClick("pantalla")}>
                  <i className="bi bi-laptop"></i> Pantalla
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => handleLinkClick("tv")}>
                  <i className="bi bi-display"></i> TV
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => handleLinkClick("usuario")}>
                  <i className="bi bi-person-fill-add"></i> Usuario
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Content */}
        <div
          className={`content ${isSidebarVisible ? "content-with-sidebar" : "content-full"}`}
        >
          {activeContent === "producto" && <CrearProducto />}
          {activeContent === "salidaPro" && <CrearSalidaPro />}
          {activeContent === "pantalla" && <CrearPantallaTVFD />}
          {activeContent === "tv" && <CrearTVFD />}
          {activeContent === "usuario" && <CrearUsuario />}
          {!activeContent && (
            <div className="center-logo">
              <img src="/logo.png" alt="Logo" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inicio;
