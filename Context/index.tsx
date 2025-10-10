"use client"
import { createContext, ReactNode, useState, useEffect } from "react"
import { BarberProps, BarberShopProps } from "@/app/types"
import { toast } from "react-toastify"



interface ContextProps{
RegisterBarber: (data: any) => Promise<void>
barber: BarberProps[] 
getBarber: ()=> void
barberShop: BarberShopProps
}

export const Context = createContext({} as ContextProps)


export function ContextProvider({children}:{children: ReactNode}){
    const [ barber, setBarber] = useState<BarberProps[]>([])
    const [barberShop, setBarberShop] = useState<BarberShopProps>({
        id: "",
        name: "",
        phone: "",
        image_url: "",
        email: "",
        neighborhood: "",
        city: "",
        street: "",
        number: "",
        public_id: ""
    })

    useEffect(()=>{
        getBarber()
        Detail()

    },[])

    async function getBarber(){
        try{
            const response = await fetch("/api/barber")
            const data = await response.json()
            console.log('dados', data)
            setBarber(Array.isArray(data) ? data : [])
        }catch(err){ 
            console.log(err)
        }
    }
 
   async function Detail(){
       try{
        const response = await fetch("/api/profile")
        const data = await response.json()
        console.log('Barbearia Shop', data)
        setBarberShop(data)
       }catch(err){
        console.log(err)    
       }

   }

    async function RegisterBarber(data: any){
          const formData = new FormData()
                formData.append("name", data.name)
                formData.append("phone", data.phone)
        
                if (data.image) {
                    formData.append("file", data.image);
                  }
                 try{
                    const response = await fetch('/api/barber',{
                        method: "POST",
                        body: formData
                    })

                    if(!response.ok) {
                         throw new Error("Erro ao cadastrar")
                    }
                  
                   toast.success("Barbeiro cadastrado com sucesso!")

                  
                 }catch(err){
                    console.log(err)
                    toast.error("Erro ao cadastrar")
                   // toast.error("Erro ao cadastrar")
                 }
                 }
    
    return(
    <Context.Provider value={{RegisterBarber, barber, getBarber, barberShop}}>
        {children}
    </Context.Provider> 
    )
}