import React from "react";
import { useAuth } from "../../context/auth/AuthContext";

export default function POS(){
    const{logout}=useAuth();
    
    return(
        <div>
            <h1>POS</h1>
            <button onClick={()=>{logout()}}>Cerrar Sesión</button>
        </div>
    )

}