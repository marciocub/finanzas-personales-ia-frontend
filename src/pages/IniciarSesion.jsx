import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion.jsx";

export default function IniciarSesion() {
  const { iniciarSesion } = useAutenticacion();
  const navegar = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");
    try {
      await iniciarSesion(correo, clave);
      navegar("/");
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-mar-900 to-slate-900">
      <form onSubmit={enviar} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-mar-900">Iniciar sesión</h1>
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
          Clave
          <input
            type="password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <button type="submit" className="w-full bg-mar-700 text-white rounded-lg py-2 font-semibold">
          Entrar
        </button>
        <p className="text-sm text-center">
          ¿No tenés cuenta?{" "}
          <Link className="text-mar-700 font-semibold" to="/registro">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
