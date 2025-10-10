"use client"
import { useState, useEffect, useContext } from "react"
import { Loader} from "lucide-react"
import { Form } from "../../../../components/form"
import { Context } from "../../../../Context"
import { FormBarber } from "../../../../components/formBarber"



export default function Register(){
    const [loading, setLoading] = useState<boolean>(true)
    const {barber} = useContext(Context)
    const [active, setActive] = useState(false)


    useEffect(() => {
        // O setLoading(true) aqui é redundante, pois o estado inicial já é true.
        // Mantive o setTimeout para simular o carregamento.
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }, [])
    if(loading){
        return(
            <div className="w-full flex flex-col h-screen bg-[#28262e] text-white justify-center items-center ">
                <h1>Carregando...</h1>
                <Loader 
                className="animate-spin"
                color="#00ff"/>
            </div>
        )
    }
    return(
       <div className="w-full flex flex-col items-center p-6 h-screen overflow-auto  bg-[#28262e] text-white">
         <div className="w-full flex flex-col shadow-md shadow-black mb-3">
           <div className="flex p-2 justify-between items-center ">
            <button 
                onClick={() => setActive(false)}
                className={`border p-2 text-white rounded-md ${active === false ? "bg-blue-800": "bg-black"}`}>
                cadastrar barbeiro
                </button>

            <button 
                onClick={() => setActive(true)}
                className={`border p-2 text-white rounded-md ${active ? "bg-blue-800": "bg-black"}`}>
                editar barbeiro
            </button>
           
           </div>
            </div>
            
           <div className="w-full flex flex-col p-5  shadow-md shadow-black">
            {active ? (
                <FormBarber />
            ): (
                <Form  />
            )}
             
           </div>

         </div>
      
    )
}