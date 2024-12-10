import React, { useState, useEffect } from "react";
import "./css/CrearUsuario.css";
import axios from "axios";

const CrearUsuario = () => {
  const [usuario, setUsuario] = useState({
    Idusuario: "",
    Contrasena: "",
    Huella: "",
    Estado: "A",
    FechaCreacion: "",
    usuario: "", // Este es el nombre del usuario que se obtendrá del localStorage
  });

  // Obtener el nombre de usuario del localStorage y actualizar el estado
  useEffect(() => {
    const storedUsuario = localStorage.getItem("usuario");
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
  }, []); // Esto se ejecuta solo una vez cuando el componente se monta

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://10.100.2.137:4001/api/UsuariosBalnazaFD",
        usuario
      );
      console.log("Usuario creado:", response.data);
    } catch (error) {
      console.error("Error:", error.message);
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
                  <button type="submit" className="btn btn-secondary">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;
