import React, { useState, useEffect } from "react";
import "./css/CrearUsuario.css";
import axios from "axios";

const CrearUsuario = () => {
  const storedUsuario = localStorage.getItem("usuario");
  const [usuario, setUsuario] = useState({
    Idusuario: "",
    Contrasena: "",
    Huella: "",
    Estado: "A",
    FechaCreacion: new Date().toISOString().split("T")[0],
    usuario: "", // Este es el nombre del usuario que se obtendrá del localStorage
    IdRol: "", 
    rolFD: { 
      idRol: 0,
      nombre: "",
      estado: "A",
    },
  });

  const [roles, setRoles] = useState([]); // Estado para almacenar los roles
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Obtener el nombre de usuario del localStorage y actualizar el estado
  useEffect(() => {
 
    if (storedUsuario) {
      setUsuario((prevState) => ({
        ...prevState,
        usuario: storedUsuario, // Establecer el usuario logueado
      }));
    }
    const today = new Date().toISOString().split("T")[0];
    setUsuario((prevState) => ({
      ...prevState,
      FechaCreacion: today,
    }));

    // Obtener los roles desde la API
    const fetchRoles = async () => {
      setLoading(true); // Iniciar carga
      try {
        const response = await axios.get("http://10.100.2.137:4001/api/RolesFD");
        console.log("Roles obtenidos:", response.data); // Muestra los roles en consola
        setRoles(response.data || []); // Guardar roles en el estado
      } catch (error) {
        console.error("Error al obtener los roles:", error.message);
        setError("No se pudieron obtener los roles. Intenta más tarde."); // Setear el mensaje de error
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchRoles();



  }, [storedUsuario]);

  useEffect(() => {
    // Si usuarioLogueado cambia, actualizamos el estado
    const usuarioLogueado = localStorage.getItem("usuario"); // Suponiendo que el valor viene de localStorage
    setUsuario((prevState) => ({
      ...prevState,
      usuario: usuarioLogueado || "", // Actualiza el nombre de usuario
    }));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo que se está cambiando es el IdRol, también actualizamos el rolFD
    if (name === "IdRol") {
      const selectedRole = roles.find((rol) => rol.idRol === parseInt(value));
      setUsuario((prevState) => ({
        ...prevState,
        IdRol: value,
        rolFD: {
          idRol: selectedRole ? selectedRole.idRol : 0,
          nombre: selectedRole ? selectedRole.nombre : "",
          estado: selectedRole ? selectedRole.estado : "A",
        },
      }));
    } else {
      setUsuario((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario.Idusuario || !usuario.Contrasena || !usuario.IdRol) {
      alert("Por favor, complete todos los campos antes de enviar.");
      return;
    }

    // Crear el objeto final que se enviará a la API
    const usuarioData = {
      idusuario: usuario.Idusuario,
      contrasena: usuario.Contrasena,
      huella: usuario.Huella,
      estado: usuario.Estado,
      usuario: usuario.usuario, // Nombre del usuario obtenido de localStorage
      fechaCreacion: usuario.FechaCreacion,
      idRol: usuario.IdRol,
      rolFD: usuario.rolFD,
    };

    setLoading(true); // Iniciar carga
    try {
      const response = await axios.post(
        "http://10.100.2.137:4001/api/UsuariosBalnazaFD",
        usuarioData
      );
      console.log("Usuario creado:", response.data);
      alert("Usuario creado con éxito.");
      setUsuario({ // Limpiar el formulario
        Idusuario: "",
        Contrasena: "",
        Huella: "",
        Estado: "A",
        FechaCreacion: new Date().toISOString().split("T")[0],
        usuario: "",
        IdRol: "",
        rolFD: { idRol: 0, nombre: "", estado: "A" }, // Reiniciar el rolFD
      });
    } catch (error) {
      console.error("Error:", error.message);
      if (error.response) {
        setError(error.response.data.message || "Error al crear el usuario.");
      } else {
        setError("Error de conexión. Intenta más tarde.");
      }
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  const handleFingerprintScan = () => {
    const simulatedFingerprint = "ABCD1234EFG5678"; // Simulación de huella
    setUsuario((prevState) => ({
      ...prevState,
      Huella: simulatedFingerprint,
    }));
    alert("Huella escaneada con éxito!");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-header text-center">
              <h4>Crear Usuario</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="Idusuario" className="form-label">
                      ID de Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Idusuario"
                      name="Idusuario"
                      value={usuario.Idusuario}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="Contrasena" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="Contrasena"
                      name="Contrasena"
                      value={usuario.Contrasena}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3 d-flex align-items-center">
                    <div className="w-100">
                      <label htmlFor="Huella" className="form-label">
                        Huella
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Huella"
                        name="Huella"
                        value={usuario.Huella}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary ms-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "54px",
                    }}
                    onClick={handleFingerprintScan}
                  >
                    <i className="bi bi-fingerprint"></i>
                  </button>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="Estado" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-control"
                      id="Estado"
                      name="Estado"
                      value={usuario.Estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="A">Activo</option>
                      <option value="I">Inactivo</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="IdRol" className="form-label">
                      Rol
                    </label>
                    <select
                      className="form-control"
                      id="IdRol"
                      name="IdRol"
                      value={usuario.IdRol}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un rol
                      </option>
                      {roles.map((rol, index) => (
                        <option key={rol.idRol || index} value={rol.idRol}>
                          {rol.nombre ?? "N/A"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="FechaCreacion" className="form-label">
                      Fecha de Creación
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="FechaCreacion"
                      name="FechaCreacion"
                      value={usuario.FechaCreacion}
                      readOnly
                    />
                  </div>
                </div>
                <div className="text-right">
                  <button type="submit" className="btn btn-secondary" disabled={loading}>
                    {loading ? "Cargando..." : "Crear Usuario"}
                  </button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;
