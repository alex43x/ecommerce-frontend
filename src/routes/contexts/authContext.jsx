import React, { useState, useEffect, useContext, createContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [autenticated, setAutenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateToken = () => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      setUser(null);
      setAutenticated(false);
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp * 1000;
      const now = Date.now();
      if (tokenExpiration < now) {
        localStorage.removeItem("AuthToken");
        setAutenticated(false);
        setLoading(false);
      }else{
        setUser(decoded);
        setAutenticated(true);
      }
    } catch (error) {
        localStorage.removeItem("AuthToken");
        setUser(null);
        setAutenticated(false);
        console.error(error);
    }
  };
  setLoading(false);

  const login=(userData,token)=>{
    localStorage.setItem("AuthToken",token);
    setUser(userData);
    setAutenticated(true);
  }
  
  const logout=()=>{
    localStorage.removeItem("AuthToken");
    setUser(null);
    setAutenticated(false);
    window.location.replace("/login");
  }

  useEffect(()=>{
    validateToken();
  },[])

  return(
    <AuthContext.Provider value={{user,autenticated,loading,login,logout}}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth=()=>useContext(AuthContext);