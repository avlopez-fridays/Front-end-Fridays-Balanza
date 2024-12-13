import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Componentes para mostrar en el área de contenido
import CrearProducto from "./CrearProducto";
import CrearPantallaTVFD from "./CrearPantallaTVFD";
import CrearTVFD from "./CrearTVFD";
import CrearUsuario from "./CrearUsuario";
import CrearSalidaPro from "./CrearSalidaPro";
import CrearSalidaVen from "./CrearSalidaVen";
import "./css/Inicio.css";

function Inicio() {
  const [activeContent, setActiveContent] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Obtener el nombre del usuario y el rol desde localStorage
  const usuarioNombre = localStorage.getItem("usuario") || "Usuario";
  const usuarioRol = localStorage.getItem("idRol") || "Sin Rol";
  const navigate = useNavigate();

  // Redirigir al login si no hay token
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/"); // Redirigir a login si no está logueado
    }

    // Prevenir navegación hacia atrás después de cerrar sesión
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, [navigate]);

  const handleLinkClick = (content) => {
    setActiveContent(content);
  };

  const isRol1 = usuarioRol === "1"; // Verificar si el rol es 1

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
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="d-flex align-items-center ms-auto">
          {/* Mostrar nombre de usuario y rol */}
          <span className="me-3">
            {usuarioNombre} <small>({usuarioRol})</small>
          </span>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              localStorage.removeItem("token"); // Limpiar el token al cerrar sesión
              localStorage.removeItem("usuario");
              localStorage.removeItem("idRol");
              alert("Sesión cerrada");
              navigate("/"); // Redirigir al login
              window.location.href = "/"; // Redirigir a la página de login
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
              {/* Mostrar siempre CrearProducto y CrearSalidaPro */}
              <li>
                <Link to="#" onClick={() => handleLinkClick("producto")}>
                  <i className="bi bi-box-arrow-in-up-left"></i> Ingresar Producto en
                  Proceso
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => handleLinkClick("salidaPro")}>
                  <i className="bi bi-box-arrow-up-left"></i> Salida de Producto
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => handleLinkClick("salidaVen")}>
                  <i
                    className="bi bi-exclamation-triangle"
                    style={{ color: "red" }}
                  ></i>{" "}
                  {/* Ícono en rojo */}
                  Salida de Producto Vencidos
                </Link>
              </li>

              {/* Mostrar otras opciones solo si el rol no es 1 */}
              {!isRol1 && (
                <>
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
                </>
              )}
            </ul>
          </div>
        )}

        {/* Content */}
        <div
          className={`content ${
            isSidebarVisible ? "content-with-sidebar" : "content-full"
          }`}
        >
          {activeContent === "producto" && <CrearProducto />}
          {activeContent === "salidaPro" && <CrearSalidaPro />}
          {activeContent === "salidaVen" && <CrearSalidaVen />}
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
