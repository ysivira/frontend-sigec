//============================================================================
// COMPONENTE RAÍZ DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Componente raíz principal (<App />) de la aplicación React.
 *
 * @description
 * Este es el componente principal que se renderiza dentro de `main.jsx`.
 *
 * Su responsabilidad es ensamblar los "Proveedores" (Providers) globales
 * que dan contexto visual y de enrutamiento a toda la aplicación:
 *
 * 1. `ThemeProvider`: Envuelve la app con el tema de diseño personalizado
 * (colores, fuentes) definido en `theme.js`.
 * 2. `CssBaseline`: Aplica un reseteo de estilos CSS (normalización)
 * de Material-UI para consistencia entre navegadores.
 * 3. `AppRouter`: Renderiza el sistema de enrutamiento principal, que
 * decide qué página mostrar según la URL.
 */

import { CssBaseline, ThemeProvider } from '@mui/material';
import sigecTheme from './theme';
import AppRouter from './router/AppRouter';

/**
 * @file App.jsx
 * @description Componente raíz de la aplicación SIGEC.
 * @returns {JSX.Element} El componente principal de la aplicación.
 */
function App() {
  return (
    <ThemeProvider theme={sigecTheme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;