//============================================================================
// COMPONENTE RAÍZ DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Componente raíz principal (<App />) de la aplicación React.
 *
 * @description
 * Este componente es el punto de entrada visual de la aplicación. Su única
 * responsabilidad es ensamblar los proveedores de contexto de más alto nivel,
 * como `ThemeProvider` para el tema de Material-UI y `CssBaseline` para la
 * normalización de estilos. Dentro de estos proveedores, renderiza el `AppRouter`,
 * que se encarga de toda la lógica de navegación.
 */

import { CssBaseline, ThemeProvider } from '@mui/material';
import sigecTheme from './theme';
import AppRouter from './router/AppRouter';

/**
 * @component App
 * @description Componente raíz que envuelve toda la aplicación con los proveedores de tema y enrutamiento.
 * @returns {JSX.Element}
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