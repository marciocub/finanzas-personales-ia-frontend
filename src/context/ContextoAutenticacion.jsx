import { createContext, useContext, useMemo, useState } from "react";
import clienteAxios from "../api/clienteAxios.js";

const ContextoAutenticacion = createContext(null);

const CLAVE_TOKEN = "tokenFinanzas";
const CLAVE_SESION = "sesionFinanzas";

export function ProveedorAutenticacion({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CLAVE_TOKEN));
  const [sesion, setSesion] = useState(() => {
    const crudo = localStorage.getItem(CLAVE_SESION);
    return crudo ? JSON.parse(crudo) : null;
  });

  const guardarSesion = (datos) => {
    localStorage.setItem(CLAVE_TOKEN, datos.token);
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({
        usuarioId: datos.usuarioId,
        correo: datos.correo,
        monedaPrincipal: datos.monedaPrincipal,
      })
    );
    setToken(datos.token);
    setSesion({
      usuarioId: datos.usuarioId,
      correo: datos.correo,
      monedaPrincipal: datos.monedaPrincipal,
    });
  };

  const iniciarSesion = async (correo, clave) => {
    const { data } = await clienteAxios.post("/api/autenticacion/inicio-sesion", {
      correo,
      clave,
    });
    guardarSesion(data);
  };

  const registrar = async (correo, clave, monedaPrincipal) => {
    const { data } = await clienteAxios.post("/api/autenticacion/registro", {
      correo,
      clave,
      monedaPrincipal,
    });
    guardarSesion(data);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_SESION);
    setToken(null);
    setSesion(null);
  };

  const valor = useMemo(
    () => ({ token, sesion, iniciarSesion, registrar, cerrarSesion }),
    [token, sesion]
  );

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion");
  }
  return contexto;
}
