import { useEffect, useState } from "react";
import clienteAxios from "../api/clienteAxios.js";
import { useAutenticacion } from "../context/ContextoAutenticacion.jsx";

const CATEGORIAS = [
  "ALIMENTACION",
  "TRANSPORTE",
  "VIVIENDA",
  "SALUD",
  "EDUCACION",
  "ENTRETENIMIENTO",
  "SERVICIOS",
  "AHORRO",
  "SUELDO",
  "OTROS",
];

function formatearMoneda(valor, moneda) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda || "ARS",
  }).format(valor || 0);
}

export default function Transacciones() {
  const { sesion } = useAutenticacion();
  const [filas, setFilas] = useState([]);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({ fechaDesde: "", fechaHasta: "", categoria: "", tipo: "" });
  const [formulario, setFormulario] = useState({
    monto: "",
    moneda: sesion?.monedaPrincipal || "ARS",
    tipo: "GASTO",
    categoria: "ALIMENTACION",
    fecha: "",
    descripcion: "",
  });

  const cargar = async () => {
    setError("");
    try {
      const parametros = {};
      if (filtros.fechaDesde) parametros.fechaDesde = `${filtros.fechaDesde}T00:00:00`;
      if (filtros.fechaHasta) parametros.fechaHasta = `${filtros.fechaHasta}T23:59:59`;
      if (filtros.categoria) parametros.categoria = filtros.categoria;
      if (filtros.tipo) parametros.tipo = filtros.tipo;
      const { data } = await clienteAxios.get("/api/transacciones", { params: parametros });
      setFilas(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudieron cargar las transacciones");
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const crear = async (evento) => {
    evento.preventDefault();
    setError("");
    try {
      await clienteAxios.post("/api/transacciones", {
        ...formulario,
        monto: Number(formulario.monto),
        fecha: formulario.fecha ? `${formulario.fecha}T12:00:00` : null,
      });
      setFormulario({ ...formulario, monto: "", descripcion: "" });
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo crear la transacción");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transacciones</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={crear} className="bg-white rounded-xl p-4 grid md:grid-cols-6 gap-3 items-end">
        <label className="text-sm">
          Monto
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={formulario.monto}
            onChange={(e) => setFormulario({ ...formulario, monto: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Tipo
          <select
            value={formulario.tipo}
            onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          >
            <option value="GASTO">GASTO</option>
            <option value="INGRESO">INGRESO</option>
          </select>
        </label>
        <label className="text-sm">
          Categoría
          <select
            value={formulario.categoria}
            onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          >
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Fecha
          <input
            type="date"
            value={formulario.fecha}
            onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="text-sm md:col-span-1">
          Descripción
          <input
            value={formulario.descripcion}
            onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          />
        </label>
        <button type="submit" className="bg-mar-700 text-white rounded-lg py-2 font-semibold">
          Agregar
        </button>
      </form>

      <div className="bg-white rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <label className="text-sm">
          Desde
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
            className="mt-1 block border rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Hasta
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
            className="mt-1 block border rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Categoría
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            className="mt-1 block border rounded-lg px-2 py-1.5"
          >
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Tipo
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="mt-1 block border rounded-lg px-2 py-1.5"
          >
            <option value="">Todos</option>
            <option value="INGRESO">INGRESO</option>
            <option value="GASTO">GASTO</option>
          </select>
        </label>
        <button type="button" onClick={cargar} className="bg-slate-800 text-white rounded-lg px-4 py-2">
          Filtrar
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Descripción</th>
              <th className="p-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id} className="border-t">
                <td className="p-3">{new Date(fila.fecha).toLocaleDateString("es-AR")}</td>
                <td className="p-3">{fila.tipo}</td>
                <td className="p-3">{fila.categoria}</td>
                <td className="p-3">{fila.descripcion}</td>
                <td className="p-3 text-right">{formatearMoneda(fila.monto, fila.moneda)}</td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td className="p-4 text-slate-500" colSpan={5}>
                  No hay transacciones para los filtros elegidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
