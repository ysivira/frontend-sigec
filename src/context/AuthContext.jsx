//============================================================================
// CONTEXTO DE AUTENTICACIÓN (ESTADO GLOBAL)
//============================================================================
/**
 * @fileoverview Proveedor de Contexto (Context Provider) para el estado global de autenticación.
 *
 * @description
 * Este archivo es el "cerebro" (estado global) que gestiona la sesión
 * del usuario en toda la aplicación
 *
 * Define y provee:
 * 1. El estado del usuario (`user`) y el `token`.
 * 2. La función `login()`:
 * - Guarda los datos en el estado.
 * - Guarda el token en `localStorage` o `sessionStorage` (según "Recuérdame").
 * - Redirige al usuario al `/dashboard`.
 * 3. La función `logout()`:
 * - Limpia el estado y el almacenamiento.
 * - Redirige al `/login`.
 *
 * Cualquier componente puede acceder a esta información usando el hook `useAuth()`.
 */

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
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
   * @description Función para iniciar sesión.
   * @param {object} data - Datos del usuario y token (¡objeto PLANO!)
   * @param {boolean} rememberMe - Si se debe recordar la sesión.
   */
  const login = (data, rememberMe) => {

    // Extrae el token
    const { token, ...datosDelUsuario } = data;
    
    // Guarda en el ESTADO
    setUser(datosDelUsuario); 
    setToken(token);

    // Guarda en el ALMACENAMIENTO
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(datosDelUsuario));
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('authUser', JSON.stringify(datosDelUsuario));
    }

    // Redirige
    navigate('/dashboard');
  };

  /**
   * @description Función para cerrar sesión.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
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