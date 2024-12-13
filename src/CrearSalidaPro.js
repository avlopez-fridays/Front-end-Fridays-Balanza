import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/CrearSalidaPro.css";
import DetalleLote from "./DetalleLote";

const CrearSalidaPro = () => {
  const [lotes, setLotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);

  // Función para obtener lotes
  const fetchLotes = async () => {
    try {
      const response = await axios.get("http://10.100.2.137:4001/api/LoteFD");
      console.log("Lotes obtenidos:", response.data);

      const lotesFiltrados = response.data.filter((lote) => lote.cantidad >= 1);
      setLotes(lotesFiltrados);
    } catch (error) {
      console.error("Error al obtener los lotes:", error);
      setLotes([]);
    }
  };

  // actualizar periódicamente
  useEffect(() => {
  
    fetchLotes();
    const intervalId = setInterval(fetchLotes, 5000); // Cada 5 segundos
    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);



  const handleModalClose = () => {
    setShowModal(false);
    setSelectedLote(null);
  };

  return (
    <div className="container">
      {/* Modal */}
      <DetalleLote
        showModal={showModal}
        selectedLote={selectedLote}
        onClose={handleModalClose}
      />

      <div className="row">
        {/* Contenedor de lotes */}
        <div className="col-lg-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h4>Lotes</h4>
            </div>
            <div className="card-body" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "800px" }}>
              {lotes && lotes.length > 0 ? (
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Seleccionar</th>
                      <th>Lote</th>
                      <th>Código Producto</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotes.map((lote, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            id={`checkbox-${index}`}
                            value={lote?.lote ?? ""}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLote(lote);
                                setShowModal(true);
                              } else {
                                handleModalClose();
                              }
                            }}
                          />
                        </td>
                        <td>{lote?.lote ?? "N/A"}</td>
                        <td>{lote?.codigoProducto ?? "N/A"}</td>
                        <td>{lote?.nombre ?? "N/A"}</td>
                        <td>{lote?.cantidad ?? "N/A"}</td>
                        <td>
                          {new Date(
                            lote?.fechaCreacion ?? "N/A"
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay lotes con cantidad mayor o igual a 1</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearSalidaPro;
