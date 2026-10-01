import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion.jsx";

export default function Registro() {
  const { registrar } = useAutenticacion();
  const navegar = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [monedaPrincipal, setMonedaPrincipal] = useState("ARS");
  const [error, setError] = useState("");

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");
    try {
      await registrar(correo, clave, monedaPrincipal);
      navegar("/");
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo registrar");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-mar-900 to-slate-900">
      <form onSubmit={enviar} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-mar-900">Crear cuenta</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <label className="block text-sm">
          Correo
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Clave (mínimo 6 caracteres)
          <input
            type="password"
            required
            minLength={6}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Moneda principal
          <select
            value={monedaPrincipal}
            onChange={(e) => setMonedaPrincipal(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BRL">BRL</option>
          </select>
        </label>
        <button type="submit" className="w-full bg-mar-700 text-white rounded-lg py-2 font-semibold">
          Registrarme
        </button>
        <p className="text-sm text-center">
          ¿Ya tenés cuenta?{" "}
          <Link className="text-mar-700 font-semibold" to="/iniciar-sesion">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
