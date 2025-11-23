//============================================================================
// CONTEXTO DE AUTENTICACIÓN (ESTADO GLOBAL)
//============================================================================
/**
 * @fileoverview Proveedor de Contexto (Context Provider) para el estado global de autenticación.
 * @description
 * Este módulo define y exporta el `AuthContext` y su `AuthProvider`.
 * El `AuthProvider` gestiona el estado de autenticación global de la aplicación,
 * incluyendo los datos del usuario y el token JWT. Proporciona funciones para
 * `login` y `logout`, y persiste el estado de la sesión utilizando
 * `localStorage` o `sessionStorage`.
 */

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * @component AuthProvider
 * @description Componente que envuelve la aplicación o partes de ella para proveer el contexto de autenticación.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  
  // ESTADOS INICIALES 
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error al leer 'authUser' del storage:", error);
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authUser');
      return null;
    }
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null;
  });
  
  const navigate = useNavigate();

  /**
   * @description Función para iniciar sesión (API + Estado).
   * @param {string} legajo - Legajo del usuario.
   * @param {string} password - Contraseña.
   * @param {boolean} rememberMe - Si se debe recordar la sesión.
   */
  const login = async (legajo, password, rememberMe = false) => {
    try {
      //  LLAMADA AL BACKEND 
      const response = await apiClient.post('/employees/login', { legajo, password });
      
      // EXTRAER DATOS
      const { token, ...datosDelUsuario } = response.data;

      // GUARDAR EN ESTADO
      setUser(datosDelUsuario);
      setToken(token);

      //  GUARDAR EN ALMACENAMIENTO 
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(datosDelUsuario));
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('authUser', JSON.stringify(datosDelUsuario));
      }

      // REDIRIGIR
      navigate('/dashboard');
      
      return true; 

    } catch (error) {
      console.error("Error en login:", error);
      throw error; 
    }
  };

  /**
   * @description Función para cerrar sesión.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    // Limpiamos ambos por seguridad
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    navigate('/login');
  };
  
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};