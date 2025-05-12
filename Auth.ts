import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";

// Token types
interface DecodedToken {
  exp: number;
  [key: string]: any;
}

// Generate code verifier
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Generate code challenge
export function generateCodeChallenge(codeVerifier: string): string {
  const hash = CryptoJS.SHA256(codeVerifier);
  return CryptoJS.enc.Base64url.stringify(hash);
}

// Decode token safely
export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp > currentTime) {
      return decoded;
    } else {
      console.warn("Token expired");
      return null;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
