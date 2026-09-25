import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const AUTH_PATHS = ["/login/", "/login/refresh/", "/auth/register/"];

function isAuthEndpoint(url = "") {
  return AUTH_PATHS.some((path) => url.includes(path));
}

api.interceptors.request.use((config) => {
  if (isAuthEndpoint(config.url)) {
    return config;
  }

  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/login/refresh/`,
          { refresh },
        );

        localStorage.setItem("access", res.data.access);
        if (res.data.refresh) {
          localStorage.setItem("refresh", res.data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
