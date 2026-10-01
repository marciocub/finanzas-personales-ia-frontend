import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Receipt, PiggyBank, LogOut, Wallet } from "lucide-react";
import { useAutenticacion } from "../context/ContextoAutenticacion.jsx";

const enlaces = [
  { to: "/", etiqueta: "Panel", icono: LayoutDashboard },
  { to: "/transacciones", etiqueta: "Transacciones", icono: Receipt },
  { to: "/presupuestos", etiqueta: "Presupuestos", icono: PiggyBank },
];

export default function LayoutPrincipal() {
  const { sesion, cerrarSesion } = useAutenticacion();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-mar-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-2 font-bold text-lg">
          <Wallet className="w-6 h-6" />
          Finanzas
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {enlaces.map(({ to, etiqueta, icono: Icono }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-white/15" : "hover:bg-white/10"
                }`
              }
            >
              <Icono className="w-4 h-4" />
              {etiqueta}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/70 truncate mb-2">{sesion?.correo}</p>
          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-2 text-sm hover:text-teal-200"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
