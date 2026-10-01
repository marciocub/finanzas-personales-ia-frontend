import axios from "axios";

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

clienteAxios.interceptors.request.use((configuracion) => {
  const token = localStorage.getItem("tokenFinanzas");
  if (token) {
    configuracion.headers.Authorization = `Bearer ${token}`;
  }
  return configuracion;
});

clienteAxios.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tokenFinanzas");
      localStorage.removeItem("sesionFinanzas");
      window.location.href = "/iniciar-sesion";
    }
    return Promise.reject(error);
  }
);

export default clienteAxios;
