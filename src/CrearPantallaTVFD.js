import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/CrearPantallaTVFD.css";

function CrearPantallaTVFD({ onPantallaCreada }) {
  const [idTV, setIdTV] = useState("");
  const [linkPantalla, setLinkPantalla] = useState("");
  const [areaFridays, setAreaFridays] = useState("");
  const [tiempoPantalla, setTiempoPantalla] = useState("");
  const [estado, setEstado] = useState("A");

  const [registros, setRegistros] = useState([]); // Estado para almacenar registros del día

  // Función para obtener registros
  const fetchRegistros = async () => {
    try {
      const response = await axios.get(
        "http://10.100.2.137:4001/api/PantallaTVFD"
      );
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
  const usuarioLogueado = localStorage.getItem("usuario"); // Asumiendo que el usuario está guardado en localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idTV || !linkPantalla || !areaFridays || !tiempoPantalla) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nuevaPantalla = {
      IdTV: idTV,
      LinkPantalla: linkPantalla,
      AreaFridays: areaFridays,
      TiempoPantalla: tiempoPantalla,
      Estado: estado,
      usuario: usuarioLogueado || "", // Asigna el usuario logueado
    };

    try {
      await axios.post(
        "http://10.100.2.137:4001/api/PantallaTVFD",
        nuevaPantalla
      );
      alert("Pantalla creada correctamente");

      // Recargar registros después de guardar
      await fetchRegistros();

      setIdTV("");
      setLinkPantalla("");
      setAreaFridays("");
      setTiempoPantalla("");
      setEstado("A");

      if (onPantallaCreada) onPantallaCreada();
    } catch (error) {
      console.error("Error al crear la pantalla:", error);
      alert("Error al crear la pantalla");
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
                  <div className="col-md-3 mb-3">
                    <label htmlFor="idTV">ID TV</label>
                    <input
                      type="text"
                      id="idTV"
                      value={idTV}
                      onChange={(e) => setIdTV(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="linkPantalla">Link de Pantalla</label>
                    <input
                      type="text"
                      id="linkPantalla"
                      value={linkPantalla}
                      onChange={(e) => setLinkPantalla(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="areaFridays">Área Fridays</label>
                    <input
                      type="text"
                      id="areaFridays"
                      value={areaFridays}
                      onChange={(e) => setAreaFridays(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="tiempoPantalla">Tiempo de Pantalla</label>
                    <input
                      type="text"
                      id="tiempoPantalla"
                      value={tiempoPantalla}
                      onChange={(e) => setTiempoPantalla(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="col-md-3 mb-3">
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
                      Crear Pantalla
                    </button>
                  </div>
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
                  <th>ID TV</th>
                  <th>Link de Pantalla</th>
                  <th>Área Fridays</th>
                  <th>Tiempo de pantalla</th>            
                  <th>Estado</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(
                  (producto, index) =>
                    producto?.idTV != null && (
                      <tr key={index}>
                        <td>{producto?.idTV ?? "N/A"}</td>
                        <td>{producto?.linkPantalla ?? "N/A"}</td>
                        <td>{producto?.areaFridays ?? "N/A"}</td>
                        <td>{producto?.tiempoPantalla ?? "N/A"}</td>
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

export default CrearPantallaTVFD;
