"use client"
import { useState } from "react"
import { FormRegister } from "../../../components/formRegister"
import { Loader} from "lucide-react"


export default function  Register(){
   const [loading, setLoading] =  useState(false)

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

   return(
    <div
     className="w-full h-screen text-gray-600  bg-[url('/barberBackNew.jpg')] p-6 bg-cover bg-center bg-no-repeat flex justify-center">
         <FormRegister title="Cadastre sua Barbearia" setLoading={setLoading} loading={loading}/>
           
    </div>
   )
}