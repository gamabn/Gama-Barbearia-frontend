"use client"
import { useState, useEffect } from "react"
import { BarberProps, BarberServiceProps, Service } from "@/app/types"
import { api } from "../../../../util/api"
import { toast } from "react-toastify"
import Image from "next/image"
import { Loader} from "lucide-react"
import { set } from "zod"



export default function ServiceBarber() {
  const [loadingBarbers, setLoadingBarbers] = useState(true)
  const [loading, setLoading] =  useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [barber, setBarber] = useState<BarberProps[]>([])
  const [id, setId] = useState<string>()
  const [idService, setIdService] = useState<string>()
  const [barberService, setBarberService] = useState<Service[]>([])

  // formulário
  const [name, setName] = useState("")
  const [temp, setTemp] = useState("")
  const [valor, setValor] = useState("")

  // busca barbeiros
  useEffect(() => {
    async function getBarber() {
      try {
        const response = await fetch("/api/barber")
        const data = await response.json()
        setBarber(Array.isArray(data) ? data : [])
      } catch (err) {
        toast.error("Erro ao carregar barbeiros")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getBarber()
  }, [])

  // busca serviços do barbeiro selecionado
  useEffect(() => {
    if (!id) return
    async function getServices() {
      setLoadingServices(true)
      try {
        const response = await api.get(`/service/${id}`)
        setBarberService(response.data)
      } catch (err) {
        toast.error("Erro ao carregar serviços")
        console.error(err)
      } finally {
        setLoadingServices(false)
      }
    }
    getServices()
  }, [id])

  // cadastro de serviço
  async function handleService() {
    setLoading(true)

    if (!id) return

    try {
      await api.post("/service", {
        name,
        duration: `${temp}:00`,
        price: Number(valor),
        barber_id: id
      })

      toast.success("Serviço cadastrado com sucesso!")
      setName("")
      setTemp("")
      setValor("")
      // recarrega lista de serviços após cadastro
      const response = await api.get(`/service/${id}`)
      setLoading(false)
      setBarberService(response.data)
    } catch (err) {
      console.error(err)
      setLoading(false)
      toast.error("Erro ao cadastrar serviço")
    }
  }

  async function handleDeleteService(id: string) {
    try {
      await api.delete(`/deleteservice/${id}`)
      window.location.reload()
      toast.success("Serviço excluído com sucesso!")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao excluir serviço")
    } finally {
      setIdService('')
    }
  }
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

  return (
    <div className="w-full  flex flex-col items-center  p-6 h-screen overflow-auto bg-[#28262e] text-white">
    
      {!loadingBarbers && barber.length === 0 && <p>Nenhum barbeiro cadastrado</p>}

      <div className="flex flex-wrap  gap-4 ">
        {barber.map((b) => (
          <button
            key={b.id}
            onClick={() => setId(b.id)}
            className={`flex border p-2 rounded-lg max-sm:w-full hover:bg-[#00ff] ${id === b.id ? "bg-[#00ff]" : "bg-[#28262e]"} hover:text-black transition-all`}
          >
            <Image
              className=" rounded-full mr-2"
              width={50}
              height={50}
              priority
              src={b.img_url || ""}
              alt="logo"
            />
            <div>
              <p>{b.name}</p>
              <p>{b.barber_phone}</p>
            </div>
          </button>
        ))}
      </div>

      {id && (
        <div className="flex items-center w-full max-sm:flex-col">
          {/* formulário */}
          <div className="flex flex-col items-center mt-3 w-[50%] border-r max-sm:w-full border-black p-3 max-sm:border-r-0 max-sm:border-b">
            <h1 className="text-2xl font-bold mb-3">Cadastre seus serviços</h1>

            <input
              className="border p-2 mb-3 w-full max-md:w-[300px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Nome do Serviço"
            />

            <input
              className="border p-2 mb-3 w-full max-md:w-[300px]"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              type="time"
              placeholder="Tempo de serviço"
            />

            <input
              className="border p-2 mb-3 w-full max-md:w-[300px]"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              type="number"
              placeholder="Valor do Serviço"
            />

            <button
              onClick={handleService}
              className="text-2xl text-white h-11 p-2 m-3 bg-[#00ff] w-full max-md:w-[300px]"
            >
              Salvar
            </button>
          </div>

          {/* lista serviços */}
          <div className="flex flex-col w-[50%] h-full px-3 max-sm:w-full">
            {loadingServices && <p>Carregando serviços...</p>}
            {!loadingServices && barberService.length === 0 && <p>Nenhum serviço encontrado</p>}

            {barberService.map((s) => (
              <div
                key={s.id}
                className="border p-3 mt-3 rounded-lg flex flex-col"
              >
                <p>Serviço: {s.name}</p>
                <p>
                  Tempo de serviço: {s.duration.hours ? `${s.duration.hours}h ` : ""}
                    {s.duration.minutes ? `${s.duration.minutes}m ` : ""}
                    {s.duration.seconds ? `${s.duration.seconds}s` : ""}
                </p>
                <p>Valor: R$ {s.price}</p>
                <button
                onClick={() => setIdService(s.id)}
                className="bg-red-500">Excluir</button>
              </div>
            ))}
          </div>
          {idService && (
            <div className="flex flex-col absolute top-0 right-0 leading-0 bottom-0 bg-gray-800/85 h-screen items-center justify-center w-full max-sm:flex-col">
                <div className="flex flex-col w-[300spx] h-[300px] bg-white p-5 text-black justify-center items-center ">
                   <h2 className="text-black text-2xl font-bold mb-3">Quer mesmo excluir?</h2>
                   <div className="flex gap-3">
                     <button 
                     onClick={() => setIdService('')}
                     className="bg-green-700 flex items-center justify-center rounded-lg p-3">Cancelar</button>

                    <button
                     onClick={() => handleDeleteService(idService)}
                     className="bg-red-500 flex items-center justify-center p-3 rounded-lg">Excluir</button>
                   </div>
                  
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
