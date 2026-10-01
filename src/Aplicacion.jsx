import { Navigate, Route, Routes } from "react-router-dom";
import { useAutenticacion } from "./context/ContextoAutenticacion.jsx";
import IniciarSesion from "./pages/IniciarSesion.jsx";
import PanelPrincipal from "./pages/PanelPrincipal.jsx";
import Presupuestos from "./pages/Presupuestos.jsx";
import Registro from "./pages/Registro.jsx";
import Transacciones from "./pages/Transacciones.jsx";
import LayoutPrincipal from "./components/LayoutPrincipal.jsx";

function RutaPrivada({ children }) {
  const { token } = useAutenticacion();
  if (!token) {
    return <Navigate to="/iniciar-sesion" replace />;
  }
  return children;
}

export default function Aplicacion() {
  return (
    <Routes>
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="/"
        element={
          <RutaPrivada>
            <LayoutPrincipal />
          </RutaPrivada>
        }
      >
        <Route index element={<PanelPrincipal />} />
        <Route path="transacciones" element={<Transacciones />} />
        <Route path="presupuestos" element={<Presupuestos />} />
      </Route>
    </Routes>
  );
}
