import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Scale } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import clienteAxios from "../api/clienteAxios.js";

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor || 0);
}

export default function PanelPrincipal() {
  const [resumen, setResumen] = useState({ totalIngresos: 0, totalGastos: 0, saldo: 0 });
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const [respuestaResumen, respuestaPresupuestos, respuestaTransacciones] = await Promise.all([
          clienteAxios.get("/api/transacciones/resumen"),
          clienteAxios.get("/api/presupuestos"),
          clienteAxios.get("/api/transacciones"),
        ]);
        setResumen(respuestaResumen.data);

        const gastosPorCategoria = {};
        (respuestaTransacciones.data || [])
          .filter((t) => t.tipo === "GASTO")
          .forEach((t) => {
            gastosPorCategoria[t.categoria] = (gastosPorCategoria[t.categoria] || 0) + Number(t.monto);
          });

        const categorias = new Set([
          ...Object.keys(gastosPorCategoria),
          ...(respuestaPresupuestos.data || []).map((p) => p.categoria),
        ]);

        setDatosGrafico(
          [...categorias].map((categoria) => {
            const presupuesto = (respuestaPresupuestos.data || []).find((p) => p.categoria === categoria);
            return {
              categoria,
              gastado: gastosPorCategoria[categoria] || 0,
              limite: presupuesto ? Number(presupuesto.montoLimite) : 0,
            };
          })
        );
      } catch (err) {
        setError(err.response?.data?.mensaje || "No se pudo cargar el panel");
      }
    };
    cargar();
  }, []);

  const tarjetas = [
    { titulo: "Ingresos", valor: resumen.totalIngresos, icono: ArrowUpRight, color: "text-emerald-600" },
    { titulo: "Gastos", valor: resumen.totalGastos, icono: ArrowDownRight, color: "text-rose-600" },
    { titulo: "Saldo", valor: resumen.saldo, icono: Scale, color: "text-mar-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel principal</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {tarjetas.map(({ titulo, valor, icono: Icono, color }) => (
          <article key={titulo} className="bg-white rounded-xl shadow-sm p-5">
            <div className={`flex items-center gap-2 text-sm ${color}`}>
              <Icono className="w-4 h-4" />
              {titulo}
            </div>
            <p className="text-2xl font-bold mt-2">{formatearMoneda(valor)}</p>
          </article>
        ))}
      </div>
      <section className="bg-white rounded-xl shadow-sm p-5 h-96">
        <h2 className="font-semibold mb-4">Gastos por categoría vs límite</h2>
        {datosGrafico.length === 0 ? (
          <p className="text-slate-500">Todavía no hay datos para graficar.</p>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(v) => formatearMoneda(v)} />
              <Legend />
              <Bar dataKey="gastado" name="Gastado" fill="#e11d48" />
              <Bar dataKey="limite" name="Límite" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
