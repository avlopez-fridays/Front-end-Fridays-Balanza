import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrearUsuario from './CrearUsuario';
import CrearProducto from './CrearProducto';
import CrearSalidaProducto from './CrearSalidaProducto';
import CrearPantallaTVFD from './CrearPantallaTVFD';
import CrearTVFD from './CrearTVFD';
import Login from './Login'; 
import Inicio from './Inicio'; // Importamos el componente de inicio
import CrearSalidaPro from './CrearSalidaPro';
import CrearSalidaVen from './CrearSalidaVen';
import DetalleLote from "./DetalleLote";

function App() {
  return (
   
    <Router>
      <div className="App">
        <Routes>
          {/* Redirigir la ruta principal (/) a Login */}
          <Route path="/" element={<Login />} /> 

          {/* Definimos la ruta para el inicio */}
          <Route path="/inicio" element={<Inicio />} />
          
          {/* Definimos las rutas para los componentes */}
          <Route path="/crear-producto" element={<CrearProducto />} />
          <Route path="/crear-salida-producto" element={<CrearSalidaProducto />} />
          <Route path="/crear-salida-pro" element={<CrearSalidaPro />} />
          <Route path="/crear-salida-ven" element={<CrearSalidaVen />} />
          <Route path="/crear-Pantalla-TVFD" element={<CrearPantallaTVFD />} />
          <Route path="/crear-TVFD" element={<CrearTVFD />} />
          <Route path="/crear-usuario" element={<CrearUsuario />} />
          <Route path="/detalle-lote" element={<DetalleLote />} />
        </Routes>
      </div>
    </Router>
   
  );
}

export default App;
