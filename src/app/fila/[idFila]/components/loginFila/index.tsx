"use client"
import { useEffect, useState } from "react"
import { api } from "../../../../../../util/api"
import { BarberShopProps } from "@/app/types"
import { useParams } from "next/navigation"
import Image from "next/image"


export function LogiFila(){
  const params = useParams()
  const idFila = params.idFila as string
 // const [ barber, setBarber ] = useState({
  //  name: "",
  //  phone: "",
  //  image_url: "",
  //  email: "",
  //  neighborhood: "",
  ////  city: "",
  //  street: "",
  //  number: "",
  //  public_id: ""
 // }) 
  const [barberShop, setBarberShop] = useState<BarberShopProps>();
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isClientRegistered, setIsClientRegistered] = useState(false)

  useEffect(() => {
    const getBarber = async () => {
      const response = await api.get(`/user/${idFila}`)
      const data = response.data
      console.log('barbeiro carregado',data)
      setBarberShop(data)
      setLoading(false)
     
      storage()
      
    }
    if(idFila){
      getBarber()
    }
  },[])

 const storage = ()=>{
  let phoneBarber = localStorage.getItem('phone')
  if(phoneBarber){
    setPhone(phoneBarber)
    setIsClientRegistered(true) // já tem cliente registrado
  }
  
 }
  async function handleCadastrarClient(){
  if(!idFila){
    return
  }
   setMessage('')

    try{
      if(!name && !phone){
        setMessage('Nome e telefone e obrigatorio')
        return
      }
      const response = await api.post('/client', {
        name,
        client_phone: phone,   
      })
      localStorage.setItem('phone', phone)
      setIsClientRegistered(true)
      setMessage('Cliente cadastrado com sucesso')
      console.log(response.data)
      setName('')
      setPhone('')
    }catch(err){
      console.log(err)
    }
  }

   if (isClientRegistered) {
    return null // já cadastrado → não mostra tela
  }

    return(
       <div className={`h-screen fixed left-0 right-0 top-0 bottom-0 z-100 flex  flex-col items-center justify-center gap-2 w-full bg-gray-800 text-white`}>
        <div className="bg-[#28262e] p-2">
          <div className="flex items-center gap-2 mb-3">
            {barberShop?.image_url ? (
               <Image src={barberShop?.image_url || ''} width={100} height={100} alt="logo"
                 className="w-[100px] h-[100px] object-cover rounded-full"/>
            ) : null}
              
               
             <div className="flex flex-col items-center gap-2">
                 <h1> {barberShop?.name}</h1>
                 <h2 className="text-white text-sm font-light">{barberShop?.phone}</h2>
             </div>
         
          </div>
        
        
        
            <div className="flex flex-col mb-3"> 
              <label htmlFor="nome">Nome</label>
              <input
              className="border text-white p-2 rounded-md"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            </div>
           
        
         <div className="flex flex-col mb-3">
             <label>Numero</label>
            <input
            placeholder="ex:(21)99999-9999"
            className="border text-white p-2 rounded-md" 
            type="text" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            />
        </div>

        <button
        onClick={handleCadastrarClient}
         className="px-4 py-2 bg-green-500 rounded text-center">
          Cadastrar
        </button>
        <h2 className="text-red-500 mt-2 text-center">{message}</h2>

      </div>
       </div>
    )
}