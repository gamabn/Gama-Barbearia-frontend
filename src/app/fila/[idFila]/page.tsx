'use client'
import { useParams } from "next/navigation"
import { useEffect, useState} from "react"
import { api } from "../../../../util/api"
import { Loader } from "lucide-react"
import { LogiFila } from "./components/loginFila"


export default function Fila(){
    const params = useParams()
    const idFila = params.idFila as string
   // const idBarber = params.idBarber as string
    const [barberShop, setBarberShop] = useState<any>()
    const [barber, setBarber] = useState<any>()
    const [loading, setLoading] = useState(false)


   // console.log(idFila)
   useEffect(() => {
    if (!idFila) return;
     getBarberShop()
     getBarbe()
     setLoading(false)

   }, [idFila]);

    async function getBarberShop() {
       try {
         const { data } = await api.get(`/user/${idFila}`);
         setBarberShop(data);
       } catch (err) {
         console.error(err);
       }
     }

     async function getBarbe(){
      try{
        const { data } = await api.get(`/allservice`)
        setBarber(data)
        console.log('Barbeiros disponiveis',data)


      }catch  (err){
        console.error(err)
      }
     }

      if (loading) {
    return (
      <div className="w-full flex flex-col h-screen bg-[#28262e] text-white justify-center items-center">
        <h1>Carregando...</h1>
        <Loader className="animate-spin" color="#00ff" />
      </div>
    );
  }

    return(
        <div className="w-full h-screen  bg-[url('/bg-agenda.jpeg')] bg-cover bg-center bg-no-repeat text-white flex flex-col items-center shadow-2xs  p-6 overflow-auto ">
           <LogiFila />
           <h1 className="text-center mt-3 ">
                Barbearia <span className="text-blue-500">{barberShop?.name}</span>         
            </h1>
            <div className="flex flex-col w-full justify-center items-center gap-4 ">
            {barber && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {barber.map((b) => (
                  <div className="border p-2" key={b.id}>
                    <h2>{b.name}</h2>
                    <p>{b.price}</p>
                  </div>
                 
              ))}
               </div>
            )}
            <button className="bg-blue-600 text-white p-3 w-3xl rounded-lg cursor-pointer">Entrar na Fila</button>
            </div>    
          
         
           
        
        </div>
       
    )

}