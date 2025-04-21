import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [autenticated, setAutenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

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
      setUser(decoded);
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
    }finally{
      setLoading(false);
    }
  };


  const login=(userData,token)=>{
    localStorage.setItem("AuthToken",token);
    const decoded=jwtDecode(token);
    setUser(decoded);
    setAutenticated(true);
    if(decoded.role==="admin"){
      navigate("/dashboard");
    }else{
      navigate("/pos");
    }
    
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