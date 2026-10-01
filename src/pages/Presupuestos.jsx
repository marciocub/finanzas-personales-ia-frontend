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

export default function Presupuestos() {
  const { sesion } = useAutenticacion();
  const [filas, setFilas] = useState([]);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState({
    categoria: "ALIMENTACION",
    montoLimite: "",
    moneda: sesion?.monedaPrincipal || "ARS",
    fechaInicio: "",
    fechaFin: "",
  });

  const cargar = async () => {
    const { data } = await clienteAxios.get("/api/presupuestos");
    setFilas(data);
  };

  useEffect(() => {
    cargar().catch((err) => setError(err.response?.data?.mensaje || "Error al cargar presupuestos"));
  }, []);

  const crear = async (evento) => {
    evento.preventDefault();
    setError("");
    try {
      await clienteAxios.post("/api/presupuestos", {
        ...formulario,
        montoLimite: Number(formulario.montoLimite),
      });
      setFormulario({ ...formulario, montoLimite: "" });
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo crear el presupuesto");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Presupuestos</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={crear} className="bg-white rounded-xl p-4 grid md:grid-cols-5 gap-3 items-end">
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
          Límite
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={formulario.montoLimite}
            onChange={(e) => setFormulario({ ...formulario, montoLimite: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Inicio
          <input
            required
            type="date"
            value={formulario.fechaInicio}
            onChange={(e) => setFormulario({ ...formulario, fechaInicio: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Fin
          <input
            required
            type="date"
            value={formulario.fechaFin}
            onChange={(e) => setFormulario({ ...formulario, fechaFin: e.target.value })}
            className="mt-1 w-full border rounded-lg px-2 py-1.5"
          />
        </label>
        <button type="submit" className="bg-mar-700 text-white rounded-lg py-2 font-semibold">
          Crear
        </button>
      </form>
      <ul className="bg-white rounded-xl divide-y">
        {filas.map((p) => (
          <li key={p.id} className="p-4 flex justify-between">
            <span>
              {p.categoria} · {p.fechaInicio} → {p.fechaFin}
            </span>
            <strong>
              {p.montoLimite} {p.moneda}
            </strong>
          </li>
        ))}
        {filas.length === 0 && <li className="p-4 text-slate-500">Todavía no hay presupuestos.</li>}
      </ul>
    </div>
  );
}
