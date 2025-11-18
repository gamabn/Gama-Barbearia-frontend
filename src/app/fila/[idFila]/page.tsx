'use client'
import { useParams } from "next/navigation"
import { useEffect, useState} from "react"
import { api } from "../../../../util/api"
import { Loader } from "lucide-react"
import { LogiFila } from "./components/loginFila"
import Image from "next/image"
import { BarberProps } from "@/app/types"


export default function Fila(){
    const params = useParams()
    const idFila = params.idFila as string
   // const idBarber = params.idBarber as string
    const [barberShop, setBarberShop] = useState<any>()
    const [barber, setBarber] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [service, setService] = useState<any[]>([]);
    const [serviceOne, setServiceOne] = useState<any[]>([]);
    const [phone, setPhone] = useState('');
    const [client, setClient] = useState({
      id:'',
      name:'',
      phone:''
    });
    const [barberOne, setBarberOne] = useState<BarberProps>({
        id: "",
        name: "",
        barber_phone: "",
        img_url: "",
        public_id: "",
        barbearia_id: "",
      });


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

    async function getServices(id: string) {
    try {
      const { data } = await api.get(`/service/${id}`);
      console.log('serviços carregados',data);
      setService(data);
    } catch (err) {
      console.error(err);
    }
  }


     async function getBarbe(){
      try{
        const { data } = await api.get(`barber/many/${idFila}`)
        setBarber(data)
        console.log('Barbeiros disponiveis',data)


      }catch  (err){
        console.error(err)
      }
     }

      const storage = ()=>{
      const client_phone = localStorage.getItem('phone')
      console.log("Chamando backend com phone:", client_phone);
      if(client_phone){
        setPhone(client_phone)
        getClient(client_phone)
      }
   }
  

  async function getClient(client_phone: string) {
    
    try {
      const { data } = await api.get(`/client/${client_phone}`)
    
      console.log('cliente carregado',data);
    setClient(data);
    } catch (err) {
      console.error(err);
    }
  }


     async function handleFila(){
      setLoading(true)
      if (!idFila) return;
      try{
        const response = await api.post('/agend', {
            client_id: client.id,
            barber_id: barberOne.id,
            service_ids: serviceOne.map((s) => s.id),
            date_agend: new Date()
          })
     
    }catch(err){
      console.log(err)
    }
    setLoading(false)
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
        <div className="w-full h-screen  bg-[url('/bg-agenda.jpeg')] bg-cover bg-center bg-no-repeat text-white flex flex-col items-center shadow-2xs   p-6 overflow-auto ">
           <LogiFila />
           <h1 className="text-center text-2xl font-bold mt-3 ">
                Barbearia <span className="text-blue-500">{barberShop?.name}</span>         
            </h1>
            <div className="border p-3 rounded-lg"> 
           <section className="flex flex-col gap-4">
                      <h2 className="text-lg font-bold border-l-4 border-[#00ff] pl-3">1. Escolha o profissional</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {barber.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => {
                              setBarberOne(b);
                              getServices(b.id);
                            }}
                            className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                    ${barberOne.id === b.id ? "border-[#00ff] bg-gray-800/50" : "border-gray-700 bg-[#1e1c24] hover:bg-gray-800/50"}`}
                >
                            <Image
                              width={80}
                              height={80}
                              src={b.img_url}
                              className="w-20 h-20 object-cover rounded-full border-2 border-gray-600"
                              alt={b.name}
                            />
                            <div className="text-center">
                              <h3 className="font-semibold">{b.name}</h3>
                              <p className="text-sm text-gray-400">{b.barber_phone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section> 

             {service.length > 0 && (
                <section className="flex flex-col gap-4 mt-4">
                  <h2 className="text- font-bold border-l-4 border-[#00ff] pl-3">2. Escolha o(s) serviço(s)</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {service.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setServiceOne([...serviceOne, s])}
                        className="bg-[#1e1c24] border border-gray-700 rounded-lg p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{s.name}</h3>
                          <p className="text-green-400 font-bold">
                            {s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400">
                          Duração: {s.duration.hours ? `${s.duration.hours}h` : ''}{s.duration.minutes ? `${s.duration.minutes}min` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )} 
              {serviceOne.length > 0 && (
                <div className="flex justify-center items-center">
                  <button
                   onClick={handleFila}
                   className="bg-blue-600 p-2  text-white font-bold rounded-lg mt-5">Entrar na Fila</button>
                </div>
              )}  

               </div>            
        </div>
       
    )

}