import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./css/CrearSalidaPro.css";

const DetalleLoteVen = ({ showModal, selectedLote, onClose }) => {
  const usuarioLogueado = localStorage.getItem("usuario");
  const [productos, setProductos] = useState([]);
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
    creosalida: usuarioLogueado || "",
    Estado: "",
    Lote: "",
  });

  const [mensaje, setMensaje] = useState("");

  const resetCampos = () => {
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
      creosalida: usuarioLogueado || "",
      Estado: "",
      Lote: "",
    });
    const qrInput = document.getElementById("QRScan");
    if (qrInput) {
      qrInput.value = ""; // Limpia el campo del QR si existe
    }
  };

  const DURACION_MENSAJE = 50000;

  useEffect(() => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) => ({
        ...producto,
        usuario: usuarioLogueado || "", // Actualiza el usuario
      }))
    );
  }, [usuarioLogueado]); // Lista de dependencias vacía

  // Función memoizada con useCallback
  const obtenerProductos = useCallback(async () => {
    try {
      const response = await fetch(
        "http://10.100.2.137:4001/api/ProductoProcesoFD"
      );
      const data = await response.json();
      const productosFiltrados = data.filter(
        (producto) => producto.lote === selectedLote.lote
      );
      setProductos(productosFiltrados);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [selectedLote]); // Dependencia de selectedLote

  // Actualización periódica
  useEffect(() => {
    if (showModal && selectedLote) {
      obtenerProductos(); // Llama la primera vez

      const intervalo = setInterval(() => {
        obtenerProductos(); // Llama cada 2 segundos
      }, 2000);

      return () => clearInterval(intervalo); // Limpia el intervalo al desmontar
    }
  }, [showModal, selectedLote, obtenerProductos]);

  if (!showModal || !selectedLote) {
    return null;
  }

  const formatFechaSQL = (fecha) => {
    const [dia, mes, anio] = fecha.split("-");
    return `20${anio}-${mes}-${dia}`; 
  };

  setTimeout(() => setMensaje(""), DURACION_MENSAJE);

  const handleQRInput = (e) => {
    let qrData = e.target.value;
    // Reemplazar todas las barras '/' por guiones '-'
    qrData = qrData.replace(/\//g, "-");

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
        creosalida: usuarioLogueado || "", // Valor predeterminado
      });
    } else {
      console.error("El formato del QR no es válido:", qrData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalida({ ...salida, [name]: value });
  };

  const eliminarProducto = async (
    codigoProducto,
    fecha,
    vence,
    correlativo
  ) => {
    try {
      const url = `http://10.100.2.137:4001/api/ProductoProcesoFD/${codigoProducto}?fecha=${fecha}&vence=${vence}&correlativo=${correlativo}`;

      // Realizar la solicitud DELETE
      const response = await axios.delete(url);
      console.log("Respuesta del servidor (eliminación):", response.data);
      setMensaje("Productos eliminados correctamente");
    } catch (error) {
      console.error("Error al eliminar productos:", error);
      setMensaje("Error al eliminar productos");
    }
    setTimeout(() => setMensaje(""), DURACION_MENSAJE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el producto pertenece al lote
    const productoEnLote = productos.some(
      (producto) => producto.codigoProducto === salida.codigoProducto
    );

    if (!productoEnLote) {
      setMensaje("Producto no se encuentra en este lote");
      // Resetear el estado de la salida
      resetCampos();
      setTimeout(() => setMensaje(""), DURACION_MENSAJE);

      return; // Detener la ejecución si el producto no pertenece al lote
    }

    try {
      // Eliminar los productos relacionados con los parámetros adicionales
      await eliminarProducto(
        salida.codigoProducto,
        salida.fecha,
        salida.vence,
        salida.correlativo
      );

      // Hacer el POST para guardar la salida
      const response = await axios.post(
        "http://10.100.2.137:4001/api/SalidaProductoVencimientoFD",
        {
          ...salida,
          Estado: "", // Enviar Estado vacío
          Lote: "",
          fechaCreacion: new Date().toISOString(),
        }
      );

      setMensaje("Salida creada exitosamente");
      setTimeout(() => setMensaje(""), DURACION_MENSAJE);

      // Resetear el estado de la salida
      resetCampos();

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
      setTimeout(() => setMensaje(""), DURACION_MENSAJE);
    }
  };

  return (
    <div
      className="modal"
      tabIndex="-5"
      style={{ display: "block", paddingTop: "1vh" }}
      aria-hidden="false"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h4 className="modal-title" style={{ fontSize: "15px" }}>
                LOTE: {selectedLote.lote}
              </h4>
              <h5 className="modal-title" style={{ fontSize: "15px" }}>
                {selectedLote.nombre}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Aquí comienza la tabla */}
            <h5 style={{ fontSize: "15px", marginBottom: "10px" }}>
              Registros de Producto vencidos
            </h5>
            <div className="table-responsive">
              <table
                className="table table-striped table-bordered"
                style={{ fontSize: "12px" }}
              >
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Código Producto</th>
                    <th>Nombre</th>
                    <th>Peso</th>
                    <th>Vendor</th>
                    <th>Fecha</th>
                    <th>Vence</th>
                    <th>Días</th>
                    <th>Correlativo</th>
                    <th>Lote</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto, index) => (
                    <tr key={producto?.id ?? "N/A"}>
                      <td>{producto?.id ?? "N/A"}</td>
                      <td>{producto?.codigoProducto ?? "N/A"}</td>
                      <td>{producto?.nombre ?? "N/A"}</td>
                      <td>{producto?.peso ?? "N/A"}</td>
                      <td>{producto?.vendor ?? "N/A"}</td>
                      <td>
                        {new Date(
                          producto?.fecha ?? "N/A"
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(
                          producto?.vence ?? "N/A"
                        ).toLocaleDateString()}
                      </td>
                      <td>{producto?.dias ?? "N/A"}</td>
                      <td>{producto?.correlativo ?? "N/A"}</td>
                      <td>{producto?.lote ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header text-center card-header-rojo">
                    <h3>Salida Producto vencido</h3>
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
                          <label
                            htmlFor="codigoProducto"
                            className="form-label"
                          >
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
                            readOnly
                            disabled
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
                            readOnly
                            disabled
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
                            readOnly
                            disabled
                          />
                        </div>
                      </div>

                      {/* Botón de enviar */}
                      <div className="text">
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            backgroundColor: "red",
                            borderColor: "red",
                            color: "white",
                          }}
                        >
                          Crear Salida
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleLoteVen;
