import axios from "axios";

const axiosInstance = axios.create({
  baseURL: (window as any).appConfig?.BASE_URL + (window as any).appConfig?.VERSION,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isAuthRequest = config.url?.includes("auth");

    if (!isAuthRequest) {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No token found, redirecting to login");
        window.location.href = "/login";
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle token expiration globally
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Session expired, redirecting...");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
