import { useState, useContext, createContext } from "react";
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

type AuthType = {
  token: string | null;
  estConnecte: boolean;
  estAdmin: boolean;
  seConnecter: (t: string) => void;
  seDeconnecter: () => void;
};

const AuthContext = createContext<AuthType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  function seConnecter(t: string) {
    localStorage.setItem("token", t);
    setToken(t);
  }

  function seDeconnecter() {
    localStorage.removeItem("token");
    setToken(null);
  }

  const verifierAdmin = (jwtToken: string | null): boolean => {
    if (!jwtToken) return false; //token manquant
    try {
      const decode = jwtDecode<TokenPayload>(jwtToken);
      return decode.role === "ADMIN";
    } catch {
      return false; //token invalide
    }
  }

  const estAdmin = verifierAdmin(token)

  return (
    <>
      <AuthContext.Provider
        value={{ token, estConnecte: !!token, estAdmin, seConnecter, seDeconnecter }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

export const useAuth = () => useContext(AuthContext);