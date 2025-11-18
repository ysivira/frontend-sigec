//============================================================================
// ENRUTADOR PRINCIPAL DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Define el sistema de enrutamiento principal de la aplicación.
 *
 * @description
 * Este componente utiliza `react-router-dom` para gestionar la navegación
 * y renderizar el componente de página correspondiente a la URL actual.
 *
 * Define todas las rutas públicas (como `/login`) y, en el futuro,
 * las rutas privadas (como `/dashboard`). También maneja las
 * redirecciones, como enviar al usuario a `/login` si accede a
NORMALMENTE * una ruta no definida.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ManageEmployeesPage from '../pages/ManageEmployeesPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ManagePlansPage from '../pages/ManagePlansPage';
import ManagePricesPage from '../pages/ManagePricesPage';

/**
 * @file AppRouter.jsx
 * @description Componente que define las rutas de la aplicación.
 * @returns {JSX.Element} El componente del enrutador de la aplicación.
 */
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="empleados" element={<ManageEmployeesPage />} />
        <Route path="planes" element={<ManagePlansPage />} />
        <Route path="precios" element={<ManagePricesPage />} />
                
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>
    
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;