import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'; 

const Login = () => {
  const [usuario, setUsuario] = useState({
    Idusuario: '',
    Contrasena: '',
  });
  const [error, setError] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.Idusuario || !usuario.Contrasena) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`http://10.100.2.137:4001/api/UsuariosBalnazaFD/${usuario.Idusuario}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error de la API:', errorMessage);
        setError('Error en la conexión con la API');
        return;
      }

      const data = await response.json();
      const contrasenaAPI = data.contrasena ? data.contrasena.trim() : '';
      const contrasenaInput = usuario.Contrasena.trim();

      if (contrasenaAPI === contrasenaInput) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('usuario', usuario.Idusuario);
        localStorage.setItem('idRol', data.idRol);
        setRol(data.rol); 
        navigate('/inicio');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error en la conexión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="logo.png" alt="Logo" className="login-logo" />
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label htmlFor="Idusuario" className="login-label">ID de Usuario:</label>
            <input
              type="text"
              id="Idusuario"
              name="Idusuario"
              className="login-input"
              value={usuario.Idusuario}
              onChange={handleChange}
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="Contrasena" className="login-label">Contraseña:</label>
            <input
              type="password"
              id="Contrasena"
              name="Contrasena"
              className="login-input"
              value={usuario.Contrasena}
              onChange={handleChange}
            />
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
        {rol && (
          <div className="login-role-info">
            <p>Usuario: {usuario.Idusuario}</p>
            <p>Rol: {rol}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
