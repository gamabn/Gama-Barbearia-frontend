'use client'
import { useParams } from "next/navigation"
import { Footer } from "../footer"
import { useState, useEffect } from "react"
import { api } from "../../../../../../util/api"
import { Loader } from "lucide-react"
import { set } from "zod"



export default function AgendClient(){
    const params = useParams()
    const idBarber = params.idBarber as string
    const [agend, setAgend] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
   // console.log(idBarber)

    useEffect(() => {
        const phone = localStorage.getItem('phone')
        async function GetAgend(){
            if(!phone){
              return;
            }
            try{
                const response = await api.get(`/agend/${phone}`)
                console.log('TODOS OS AGENDAMENTOS',response.data)
                setAgend(response.data)
                setLoading(false)

            }catch(error){
                console.log(error)
                setLoading(false)
            }

        }
        //console.log('telefone do cliente',phone)
        GetAgend()
    },[])


  if (loading) {
    return (
      <div className="w-full flex flex-col h-screen bg-[#28262e] text-white justify-center items-center">
        <h1>Carregando...</h1>
        <Loader className="animate-spin" color="#00ff" />
      </div>
    );
  }


    const date = new Date()

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#28262e] text-white overflow-auto  p-5">
      {agend && agend.length > 0 ? (
        <>
          <h1 className="text-xl font-bold mb-4">Serviços Agendados</h1>

          {agend.map((a) => {
            const dateAgend = new Date(a.date_agend)
            const isFuture = dateAgend > date

            return (
              <div key={a.id} className="mb-4 border-b border-gray-600 pb-2">
                {isFuture ? (
                  <>
                    <h2 className="text-green-400">⏳ Serviço Pendente</h2>
                    <p>Barbeiro: {a.barber_name}</p>
                    <p>Data: {dateAgend.toLocaleString('pt-BR')}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-gray-400">✅ Serviço Finalizado</h2>
                    <p>Barbeiro: {a.barber_name}</p>
                    <p>Data: {dateAgend.toLocaleString('pt-BR')}</p>
                  </>
                )}
              </div>
            )
          })}
        </>
      ) : (
        <h2>Nenhum serviço agendado ou finalizado</h2>
      )}

      <Footer />
    </div>
  )
}