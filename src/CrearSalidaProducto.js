import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/CrearSalidaProducto.css";

const CrearSalidaProducto = () => {
  const [salida, setSalida] = useState({
    codigoProducto: "",
    peso: 0,
    fecha: "",
    vence: "",
    dias: 0,
    qr: "",
    FechaCreacion: new Date().toISOString().split("T")[0],
    nombre: "",
    correlativo: "",
    usuario: "",
    creosalida: "UsuarioPredeterminado",
    Estado: "",
    Lote: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [registros, setRegistros] = useState([]); // Estado para almacenar registros del día

  // Función para obtener registros
  const fetchRegistros = async () => {
    try {
      const response = await axios.get("http://10.100.2.137:4001/api/SalidasProductoFD");
      console.log("Datos obtenidos:", response.data); // Verifica la estructura de los datos

      // Filtra los registros para que solo se muestren aquellos cuya FechaCreacion coincida con la fecha actual
      const registrosFiltrados = response.data.filter((producto) => {
        const fechaCreacion = new Date(producto?.fechaCreacion);
        const fechaActual = new Date(); // Fecha actual
        return (
          fechaCreacion.getFullYear() === fechaActual.getFullYear() &&
          fechaCreacion.getMonth() === fechaActual.getMonth() &&
          fechaCreacion.getDate() === fechaActual.getDate()
        );
      });

      setRegistros(registrosFiltrados);
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setRegistros([]); // En caso de error, asegúrate de que no se quede vacío
    }
  };

  useEffect(() => {
    fetchRegistros(); // Llama a la función al montar el componente
  }, []);

  const formatFechaSQL = (fecha) => {
    const [dia, mes, anio] = fecha.split("-");
    return `20${anio}-${mes}-${dia}`; // Cambiar formato si es necesario
  };

  const handleQRInput = (e) => {
    const qrData = e.target.value;
    console.log("Contenido del QR:", qrData);

    const qrParts = qrData.split(",");

    if (qrParts.length === 9) {
      // Asegurarnos que el QR tiene 9 partes
      setSalida({
        codigoProducto: qrParts[0].trim(),
        nombre: qrParts[1].trim(),
        usuario: qrParts[2].trim(), // Nuevo campo usuario desde el QR
        peso: parseFloat(qrParts[4].trim()),
        fecha: formatFechaSQL(qrParts[5].trim()),
        vence: formatFechaSQL(qrParts[6].trim()),
        dias: parseInt(qrParts[7].trim(), 10),
        correlativo: qrParts[8].trim(), // Extraemos el correlativo
        qr: qrData.trim(),
        FechaCreacion: new Date().toISOString().split("T")[0],
        creosalida: "UsuarioPredeterminado", // Valor predeterminado
      });
    } else {
      console.error("El formato del QR no es válido:", qrData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalida({ ...salida, [name]: value });
  };

  const eliminarProducto = async (codigoProducto, fecha, vence, correlativo) => {
    try {
      // Corregir la URL para concatenar correctamente los parámetros con '&'
      const url = `http://10.100.2.137:4001/api/ProductoProcesoFD/${codigoProducto}?fecha=${fecha}&vence=${vence}&correlativo=${correlativo}`;

      // Realizar la solicitud DELETE
      const response = await axios.delete(url);
      console.log("Respuesta del servidor (eliminación):", response.data);
      setMensaje("Productos eliminados correctamente");
    } catch (error) {
      console.error("Error al eliminar productos:", error);
      setMensaje("Error al eliminar productos");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Eliminar los productos relacionados con los parámetros adicionales
      await eliminarProducto(salida.codigoProducto, salida.fecha, salida.vence, salida.correlativo);

      // Hacer el POST para guardar la salida
      const response = await axios.post("http://10.100.2.137:4001/api/SalidasProductoFD", {
        ...salida,
        Estado: "",  // Enviar Estado vacío
        Lote: "", 
        fechaCreacion: new Date().toISOString(),
      });

      setMensaje("Salida creada exitosamente");

      // Resetear el estado de la salida
      setSalida({
        codigoProducto: "",
        peso: 0,
        fecha: "",
        vence: "",
        dias: 0,
        qr: "",
        FechaCreacion: new Date().toISOString().split("T")[0],
        nombre: "",
        correlativo: "",
        usuario: "",
        creosalida: "UsuarioPredeterminado",
        Estado: "",
        Lote: "",
      });

      // Limpiar el campo del código QR
      document.getElementById("QRScan").value = "";

      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al crear la salida:", error);
      setMensaje("Error al crear la salida");

      // Verificar si el error es de tipo 409 (Conflict)
      if (error.response && error.response.status === 409) {
        setMensaje("Este producto ya ha registrado su salida..");
      } else {
        setMensaje("Error al crear la salida");
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header text-center">
              <h3>Salida Producto</h3>
            </div>

            {/* Si hay un mensaje, mostrarlo como una alerta */}
            {mensaje && (
              <div className="alert alert-danger" role="alert">
                {mensaje}
              </div>
            )}

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Código QR */}
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="QRScan" className="form-label">
                      Código QR
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="QRScan"
                      placeholder="Escanea o escribe el código QR"
                      onChange={handleQRInput}
                    />
                  </div>

                  {/* Código Producto */}
                  <div className="col-md-3 mb-3">
                    <label htmlFor="codigoProducto" className="form-label">
                      Código del Producto
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigoProducto"
                      name="codigoProducto"
                      value={salida.codigoProducto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Nombre */}
                  <div className="col-md-3 mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={salida.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Peso */}
                  <div className="col-md-3 mb-3">
                    <label htmlFor="peso" className="form-label">
                      Peso
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="peso"
                      name="peso"
                      value={salida.peso}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Botón de enviar */}
                <div className="text">
                  <button type="submit" className="btn btn-primary">
                    Crear Salida
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12">
              {registros && registros.length > 0 ? (
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Correlativo</th>
                      <th>Código Producto</th>
                      <th>Nombre</th>
                      <th>Peso</th>
                      <th>Fecha</th>
                      <th>Vence</th>
                      <th>Días</th>
                      <th>Usuario</th>
                      <th>Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((producto, index) => {
                      return (
                        <tr key={index}>
                          <td>{producto?.correlativo ?? "N/A"}</td>
                          <td>{producto?.codigoProducto ?? "N/A"}</td>
                          <td>{producto?.nombre ?? "N/A"}</td>
                          <td>{producto?.peso ?? "N/A"}</td>
                          <td>{producto?.fecha ?? "N/A"}</td>
                          <td>{producto?.vence ?? "N/A"}</td>
                          <td>{producto?.dias ?? "N/A"}</td>
                          <td>{producto?.usuario ?? "N/A"}</td>
                          <td>{producto?.fechaCreacion ?? "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div>No hay salidas registradas para el día de hoy</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearSalidaProducto;