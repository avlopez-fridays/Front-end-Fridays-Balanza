
import React, { useState, useEffect } from "react";

import axios from "axios";
import "./css/CrearProducto.css";

  // Obtener el usuario logueado
  const usuarioLogueado = localStorage.getItem("usuario");
const CrearProducto = () => {
  const [producto, setProducto] = useState({
    CodigoProducto: "",
    Nombre: "",
    Peso: "",
    Vendor: "",
    Fecha: "",
    Vence: "",
    Dias: "",
    QR: "",
    correlativo: "",
    Lote: "",  // Campo Lote vacío por defecto
    usuario: usuarioLogueado || "",
    FechaCreacion: new Date().toISOString().split("T")[0], 
  });

  const [registros, setRegistros] = useState([]); // Estado para almacenar registros del día
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error

  // Función para obtener registros
  const fetchRegistros = async () => {
    try {
      const response = await axios.get(
        "http://10.100.2.137:4001/api/ProductoProcesoFD"
      );
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

  // Función para formatear fechas en formato SQL (YYYY-MM-DD)
  const formatFechaSQL = (fecha) => {
    const [dia, mes, anio] = fecha.split("-");
    return `20${anio}-${mes}-${dia}`;
  };

  // Manejar entrada del código QR
  const handleQRInput = (e) => {
    let qrData = e.target.value;
  // Reemplazar todas las barras '/' por guiones '-'
     qrData = qrData.replace(/\//g, "-");

    setProducto((prevState) => ({
      ...prevState,
      QR: qrData,
    }));

    console.log("Contenido del QR:", qrData);

    const qrParts = qrData.split(",");
    if (qrParts.length >= 9) {
      try {
        setProducto((prevState) => ({
          ...prevState,
          CodigoProducto: qrParts[0].trim(),
          Nombre: qrParts[1].trim(),
          Vendor: qrParts[2].trim(),
          Peso: parseFloat(qrParts[4].trim().replace(",", ".")),
          Fecha: formatFechaSQL(qrParts[5].trim()),
          Vence: formatFechaSQL(qrParts[6].trim()),
          Dias: qrParts[7].trim(),
          correlativo: qrParts[8].trim(),
        }));
      } catch (error) {
        console.error("Error al procesar el QR:", error);
      }
    } else {
      console.error("El formato del QR no es válido:", qrData);
    }
  };

  //MANEJADOR
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aseguramos que los valores de Nombre, Vendor y Usuario estén en mayúsculas antes de enviarlos
      const productoConMayusculas = {
        ...producto,
        Nombre: producto.Nombre.toUpperCase(),
        Vendor: producto.Vendor.toUpperCase(),
        usuario: producto.usuario.toUpperCase(),
      };

      // Eliminar Id si existe
      const { Id, ...productoSinId } = productoConMayusculas;

      // Enviar los datos con los valores en mayúsculas
      const response = await axios.post(
        "http://10.100.2.137:4001/api/ProductoProcesoFD",
        productoSinId
      );

      console.log("Producto creado:", response.data);

      // Recargar registros después de guardar
      await fetchRegistros();

      // Agregar producto al estado de registros
      setRegistros((prevRegistros) => [
        ...prevRegistros,
        productoConMayusculas,
      ]);

      // Reiniciar los campos del formulario
      setProducto({
        CodigoProducto: "",
        Nombre: "",
        Peso: "",
        Vendor: "",
        Fecha: "",
        Vence: "",
        Dias: "",
        QR: "",
        correlativo: "",
        Lote: "",  // Reset del campo Lote
        usuario: "",
        FechaCreacion: new Date().toISOString().split("T")[0], // Fecha actual
      });
     
      // Limpiar mensaje de error
      setError("");
    } catch (error) {
      console.error("Error al crear el producto:", error.message);

      console.log(error.response);

      // Verificar si el error es un 404 (producto ya ingresado)
      if (error.response && error.response.status === 404) {

        setError("Este producto ya ha sido ingresado a la bodega.");
       
        // Limpiar los campos después de mostrar el mensaje de error
        setProducto({
          CodigoProducto: "",
          Nombre: "",
          Peso: "",
          Vendor: "",
          Fecha: "",
          Vence: "",
          Dias: "",
          QR: "",
          correlativo: "",
          Lote: "",  // Reset del campo Lote
          usuario: "",
          FechaCreacion: new Date().toISOString().split("T")[0], // Fecha actual
        });
      } else {
        setError("Este producto ya ha sido ingresado a la bodega.");
      }

      setProducto({
        CodigoProducto: "",
        Nombre: "",
        Peso: "",
        Vendor: "",
        Fecha: "",
        Vence: "",
        Dias: "",
        QR: "",
        correlativo: "",
        Lote: "",  // Reset del campo Lote
        usuario: "",
        FechaCreacion: new Date().toISOString().split("T")[0], // Fecha actual
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header text-center">
              <h3>Ingresar Producto</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
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
                      value={producto.QR}
                      onChange={handleQRInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="CodigoProducto" className="form-label">
                      Código de Producto
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="CodigoProducto"
                      name="CodigoProducto"
                      value={producto.CodigoProducto}
                      onChange={handleChange}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="Nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Nombre"
                      name="Nombre"
                      value={producto.Nombre}
                      onChange={handleChange}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="Peso" className="form-label">
                      Peso
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="Peso"
                      name="Peso"
                      value={producto.Peso}
                      onChange={handleChange}
                      readOnly
                      disabled
                    />
                  </div>
         
                </div>
               
                <div className="text">
                  <button type="submit" className="btn btn-primary">
                    Crear Producto
                  </button>
                </div>
              </form>

            
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
  <div className="col-lg-12">

    {registros && registros.length > 0 ? (
      <div className="table-responsive">
      <table className="table">
        <thead className="table-light">
          <tr>
          <th>Correlativo</th>
            <th>Código Producto</th>
            <th>Nombre</th>
            <th>Peso</th>
            <th>Vendor</th>
            <th>Fecha</th>
            <th>Vence</th>
            <th>Días</th>
          
            <th>Fecha Creación</th> {/* Nueva columna para la fecha de creación */}
          </tr>
        </thead>
        <tbody>
          {registros.map((producto, index) => {
            console.log(producto); // Verifica que las propiedades estén correctamente disponibles
            return (
              <>
                {producto?.codigoProducto != null && (
                  <tr key={index}>
                       <td>{producto?.correlativo ?? "N/A"}</td>
                    <td>{producto?.codigoProducto ?? "N/A"}</td>
                    <td>{producto?.nombre ?? "N/A"}</td>
                    <td>{producto?.peso ?? "N/A"}</td>
                    <td>{producto?.vendor ?? "N/A"}</td>
                    <td>
                      {producto?.fecha
                        ? new Date(producto?.fecha).toLocaleDateString("es-ES")
                        : "N/A"}
                    </td> 
                    <td>
                      {producto?.vence
                        ? new Date(producto?.vence).toLocaleDateString("es-ES")
                        : "N/A"}
                    </td> 
                    <td>{producto?.dias ?? "N/A"}</td>
                 
                    <td>
                      {producto?.fechaCreacion
                        ? new Date(producto?.fechaCreacion).toLocaleDateString()
                        : "N/A"}
                    </td> 
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
      </div>
    ) : (
      <p>Cargando...</p> // Muestra un mensaje mientras los datos están cargando
    )}
  </div>
</div>





    </div>
  );
};

export default CrearProducto;
