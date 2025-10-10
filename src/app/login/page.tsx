"use client"
import { useState } from "react";
import { Loader } from "lucide-react";
import { FormLogin } from "../../../components/formLogin";


export default function Login() {
    const [loading, setLoading] = useState(false)

       if(loading){
        return(
            <div className="w-full flex flex-col h-screen bg-[#fff] text-white justify-center items-center ">
                <h1>Carregando...</h1>
                <Loader 
                className="animate-spin"
                color="#00ff"/>
            </div>
        )
    }
    return (
    <div className="w-full h-screen text-gray-600 bg-[url('/bg-hero.jpg')] p-6 bg-cover bg-center bg-no-repeat flex justify-center">
      <FormLogin title="Entrar na sua conta" setLoading={setLoading} />
    </div>
  );

}