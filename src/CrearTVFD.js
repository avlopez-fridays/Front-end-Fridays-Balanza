import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/CrearTVFD.css";

function CrearTVFD() {
  const [ip, setIp] = useState("");
  const [areaFridays, setAreaFridays] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [tiempoRecargo, setTiempoRecargo] = useState("");
  const [estado, setEstado] = useState("A");

  const [registros, setRegistros] = useState([]); // Estado para almacenar registros del día

  // Función para obtener registros
  const fetchRegistros = async () => {
    try {
      const response = await axios.get("http://10.100.2.137:4001/api/TVFD");
      console.log("Datos obtenidos:", response.data);

      setRegistros(response.data);
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setRegistros([]);
    }
  };

  useEffect(() => {
    fetchRegistros(); // Llama a la función al montar el componente
  }, []);

   // Obtener el usuario logueado
   const usuarioLogueado = localStorage.getItem("usuario");


  useEffect(() => {
    setRegistros((prevProductos) =>
      prevProductos.map((producto) => ({
        ...producto,
        usuario: usuarioLogueado || "", // Actualiza el usuario
      }))
    );
  }, [usuarioLogueado]); // Lista de dependencias vacía
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida que todos los campos tengan datos
    if (!ip || !areaFridays || !descripcion || !marca || !tiempoRecargo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const tvfd = {
      Ip: ip,
      AreaFridays: areaFridays,
      Descripcion: descripcion,
      Marca: marca,
      TiempoRecargo: tiempoRecargo,
      Estado: estado,
      usuario: usuarioLogueado || "",
    };

    try {
      // Crear nuevo TVFD
      const response = await axios.post(
        "http://10.100.2.137:4001/api/TVFD",
        tvfd
      );
      alert("TVFD creado correctamente");

      // Recargar registros después de guardar
      await fetchRegistros();

      // Resetear el formulario después de enviar
      setIp("");
      setAreaFridays("");
      setDescripcion("");
      setMarca("");
      setTiempoRecargo("");
      setEstado("A");
    } catch (error) {
      // Mostrar el error detallado
      console.error(
        "Error al crear el TVFD:",
        error.response ? error.response.data : error.message
      );
      alert(
        `Error al registrar el TVFD: ${
          error.response ? error.response.data : error.message
        }`
      );
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header text-center">
              <h4>Crear Pantalla TVFD</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="ip">IP</label>
                    <input
                      type="text"
                      id="ip"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="areaFridays">Área Fridays</label>
                    <input
                      type="text"
                      id="areaFridays"
                      value={areaFridays}
                      onChange={(e) => setAreaFridays(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="descripcion">Descripción</label>
                    <input
                      type="text"
                      id="descripcion"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="marca">Marca</label>
                    <input
                      type="text"
                      id="marca"
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="tiempoRecargo">Tiempo de Recargo</label>
                    <input
                      type="text"
                      id="tiempoRecargo"
                      value={tiempoRecargo}
                      onChange={(e) => setTiempoRecargo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="estado">Estado</label>
                    <select
                      id="estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      required
                    >
                      <option value="A">Activo</option>
                      <option value="I">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="text-right">
                  <button type="submit" className="btn btn-secondary">
                    Registrar TV
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mostrar la tabla de registros */}
      <div className="row mt-4">
        <div className="col-lg-12">
          {registros && registros.length > 0 ? (
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Ip</th>
                  <th>Área Fridays</th>
                  <th>Descripción</th>
                  <th>Marca</th>
                  <th>Tiempo Recargo</th>
                  <th>Estado</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(
                  (producto, index) =>
                    producto?.ip != null && (
                      <tr key={index}>
                        <td>{producto?.ip ?? "N/A"}</td>
                        <td>{producto?.areaFridays ?? "N/A"}</td>
                        <td>{producto?.descripcion ?? "N/A"}</td>
                        <td>{producto?.marca ?? "N/A"}</td>
                        <td>{producto?.tiempoRecargo ?? "N/A"}</td>
                        <td>{producto?.estado ?? "N/A"}</td>
                        <td>{producto?.usuario ?? "N/A"}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          ) : (
            <p>Cargando...</p> // Muestra un mensaje mientras los datos están cargando
          )}
        </div>
      </div>
    </div>
  );
}

export default CrearTVFD;
