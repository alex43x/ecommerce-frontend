import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import loginImage from "../../images/loginImage.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        setError({ ...error, email: "Debes ingresar tu correo electrónico" });
        return;
      }
      if (!password) {
        setError({ ...error, password: "Debes ingresar tu contraseña" });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      console.log(data.token)
      if (response.ok) {
        login(data, data.data.token);
      } else {
        setError({ ...error, other: data.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Formulario */}
      <form className="flex flex-col justify-center p-6 w-full sm:w-4/5 md:w-1/2 lg:w-1/3">
        <div className="mb-10 text-center">
          <h1 className="text-green-800 inline">POS </h1>
          <p className="inline font-bold text-3xl">Tienda</p>
        </div>

        <h2 className="text-green-800 text-center">Iniciar sesión</h2>
        <p className="font-medium my-2 text-center">
          Ingresa tu correo electrónico y contraseña
        </p>

        <section className="block w-10/12 mx-auto">
          <label className="inline-block w-full my-2">
            <input
              type="email"
              className="bg-white inline-block w-full px-3 py-1"
              placeholder="Correo Electrónico"
              onChange={(e) => {
                setEmail(e.target.value);
                setError({ ...error, email: "" });
              }}
            />
            {error.email && <p className="text-red-600">{error.email}</p>}
          </label>
          <label className="block">
            <input
              type="password"
              className="my-2 inline-block w-full px-3 py-1"
              placeholder="Contraseña"
              onChange={(e) => {
                setPassword(e.target.value);
                setError({ ...error, password: "" });
              }}
            />
            {error.password && <p className="text-red-600">{error.password}</p>}
          </label>
          {error.other && <p className="text-red-600">{error.other}</p>}
          <button
            className="bg-green-800 text-white py-2 mt-4 w-full"
            onClick={(e) => handleSubmit(e)}
          >
            Continuar
          </button>
        </section>
      </form>

      {/* Imagen */}
      <div className="hidden md:block w-1/2 lg:w-2/3 h-screen">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
export default Login;
