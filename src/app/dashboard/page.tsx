'use client'
import { api } from "../../../util/api"
import { Context } from "../../../Context"
import { Loader, ClockPlus } from "lucide-react"
import { useEffect,useContext, useState, use } from "react"
import { format } from "date-fns"
import { socket } from "../../../components/Socket"



export default  function Dashboard(){
    const { barberShop } = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [agendamentos, setAgendamentos] = useState<any[]>([])
    const [deleteId, setDeleteId] = useState<string | null>('')


    console.log('barberShop',barberShop)

   useEffect(() => {
    socket.on("connect", () => {
    //  console.log("Conectado ao servidor Socket.IO");
    });

  socket.on("agendamentos", (data) => {
      //console.log("Recebido via socket:", data);
      setAgendamentos(data); // substitui o array atual pelos novos dados
    });

    return () => {
      socket.off("agendamentos");
      socket.off("connect");
    };
  }, []);


  useEffect(() => {
    if (barberShop?.id) {
      getHorarios();
    }
    }, [barberShop?.id]);

        async function getHorarios(){
          const response = await api.get(`/agendamento/${barberShop?.id}`)
          console.log('Horarios cadastrados',response.data)
          setAgendamentos(response.data)
          setLoading(false)
    }

    async function handleDelete(){
      if(!deleteId) return;
      setLoading(true)
      try{
          const response = await api.delete(`/agend/${deleteId}`)
          window.location.reload()
          setLoading(false)
          console.log(response.data)
      }catch(err){
          console.log(err)
          setLoading(false)
      }   
      setDeleteId('')
    }

  if (loading) {
    return (
      <div className="w-full h-screen flex  text-white  bg-[#28262e] justify-center items-center">
        <h1>Carregando...</h1>
        <Loader className="animate-spin" color="#00ff" />
      </div>
    );
  }

   const agendamentosPendentes = agendamentos.filter((a) => a.status === 'waiting')

    return (
        <div className="w-full h-screen bg-[#28262e] text-white flex flex-col p-6 overflow-auto">
          {deleteId && (
            <div className="flex flex-col absolute top-0 right-0 leading-0 bottom-0 bg-gray-800/85 h-screen items-center justify-center w-full max-sm:flex-col">
              <div className="flex gap-2 max-sm:flex-col">
                  <button onClick={handleDelete}className="text-2xl font-bold text-red-500 border p-2 rounded-lg">Quer mesmo excluir?</button>
                  <button  onClick={() => setDeleteId('')} className="text-2xl font-bold text-blue-500 border p-2 rounded-lg">Cancelar</button>
              </div>
             
          </div>
          )}
          
          <div className="flex gap-1 items-center justify-center">
             <h1 className="text-2xl font-bold text-blue-500">Serviços agendado</h1>
             <span><ClockPlus size={20} color="#00ff"/></span>
          </div>
           
           <div className="flex flex-col w-full mt-3">
            {agendamentosPendentes.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {agendamentosPendentes.map((a) => (
                  <div key={a.id} className="mb-4 border border-gray-600 p-2">
                    <h2 className="text-white">Cliente: {a.client_name}</h2>
                    <p>Barbeiro: {a.barber_name}</p>
                    <p>Data: {format(new Date(a.date_agend), 'dd/MM/yyyy HH:mm')}</p>
                 
                 <div>
                {a.services.map((s) => (
                  <div key={s.id} className="flex gap-2">
                      <h2>{s.name}</h2>
                      <p className="flex gap-1 text-green-500">R$ {s.price}</p>
                      <p className="flex gap-1"><ClockPlus size={17} color="#00ff"/>{s.duration}</p>
                  </div>              
                ))}
                 </div>

                 <div className="w-full flex justify-between">
                    <button className="bg-green-500 p-2 rounded-lg">
                      Finalizar
                    </button>
                    <button
                    onClick={() => setDeleteId(a.id)}
                     className="bg-red-500 p-2 rounded-lg">
                      Excluir
                    </button>
                 </div>
               
                  </div>
                ))}
              </div>
            ):(
              <div>
                <p>Nenhum serviço agendado</p>
              </div>
            )
}
             

           </div>
        </div>
    )
}