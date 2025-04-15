import React, { useState } from "react";

function Login(){
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const handleSubmit= async(e)=>{
        e.preventDefault();
        try{
            const response= await fetch(`${import.meta.env.VITE_API_URL}/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email,
                    password,
                })

            })
            const data=await response.json();
            if(response.ok){
                login({email,password})
            }
        }catch(error)
        {
            console.error(error);
        }

    }

    return(
        <div>
            <form action="">
                <h1>Iniciar sesión</h1>
                <p>Ingresa tu correo electrónico y la contraseña</p>
                <input type="email" placeholder="Correo Electrónico" onChange={(e)=>{setEmail(e.target.value)}}/>
                <input type="password" placeholder="Tu contraseña" onChange={(e)=>{setPassword(e.target.value)}} />
                <button onClick={(e)=>{handleSubmit(e)}}></button>
            </form>
        </div>
    )
}
export default Login;