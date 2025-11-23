//============================================================================
// ENRUTADOR PRINCIPAL DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Define el sistema de enrutamiento principal de la aplicación.
 *
 * @description
 * Este componente utiliza `react-router-dom` para gestionar la navegación
 * y renderizar el componente de página correspondiente a la URL actual. Define
 * dos tipos de rutas:
 * - **Rutas Públicas**: Accesibles sin autenticación (ej: `/login`, `/register`).
 * - **Rutas Privadas**: Anidadas dentro del `MainLayout`, que actúa como un
 *   guardián, requiriendo autenticación para acceder a ellas (ej: `/dashboard`).
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
import ConfirmEmailPage from '../pages/ConfirmEmailPage';
import ManagePlansPage from '../pages/ManagePlansPage';
import ManagePricesPage from '../pages/ManagePricesPage';
import QuoterPage from '../pages/quoter/QuoterPage';
import QuoterListPage from '../pages/quoter/QuoterListPage';
import ProfilePage from '../pages/ProfilePage';
import PriceListViewPage from '../pages/PriceListViewPage';


/**
 * @component AppRouter
 * @description Componente principal que define la estructura de navegación de la aplicación,
 * distinguiendo entre rutas públicas y rutas privadas protegidas que se renderizan
 * dentro del layout principal.
 * @returns {JSX.Element} El componente del enrutador de la aplicación.
 */
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="empleados" element={<ManageEmployeesPage />} />
        <Route path="planes" element={<ManagePlansPage />} />
        <Route path="precios" element={<ManagePricesPage />} />
        <Route path="/cotizador" element={<QuoterPage />} />
        <Route path="/mis-cotizaciones" element={<QuoterListPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/precios-consulta" element={<PriceListViewPage />} />

        <Route index element={<Navigate to="/login" replace />} />
      </Route>

      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;