'use client'
import { api } from "../../../util/api"
import { Context } from "../../../Context"
import { useEffect,useContext } from "react"

export default  function Dashboard(){
    const { barberShop } = useContext(Context)
    console.log('barberShop',barberShop)

  useEffect(() => {
  if (barberShop?.id) {
    getHorarios();
  }
}, [barberShop?.id]);
  async function getHorarios(){
    const response = await api.get(`/agendamento/${barberShop?.id}`)
    console.log('Horarios cadastrados',response.data)
  }
   
    return (
        <div className="w-full h-screen bg-[#28262e] text-white flex justify-center items-center">
            <h1>Dashboard</h1>
        </div>
    )
}