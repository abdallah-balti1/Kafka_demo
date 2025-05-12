import { useEffect } from "react";
import { decodeToken, getAccessToken, isTokenExpired, clearTokens } from "./utils/auth";

function App() {
  useEffect(() => {
    const token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      clearTokens();
      window.location.href = "/";
    }
  }, []);

  return (
    // your routes or layout
  );
}
