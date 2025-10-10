"use client"
import { useState, useContext, useEffect, } from "react";
import { Loader, Trash2} from "lucide-react"
import { api } from "../../../../util/api";
import { Context } from "../../../../Context";
import { barberWeekHours } from "@/app/types";

export default function Clock(){
    const { barberShop } = useContext(Context)
     const [dayOfWeek, setDayOfWeek] = useState("1");
     const [startTime, setStartTime] = useState("");
     const [endTime, setEndTime] = useState("");
     const [active, setActive] = useState(true);
     const [loading, setLoading] = useState(false)
     const [horarios, setHorarios] = useState<barberWeekHours[]>([])

      const diasDaSemana = [
        null, // Posição 0, não usada
       
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
        "Domingo",
    ];

     useEffect(() => {
         if (!barberShop?.id) return; // evita chamada com id indefinido
          setLoading(true);

        async function getHorarios(){
            try{
                const response = await api.get(`/horarios/${barberShop.id}`)             
                console.log('Horarios cadastrados',response.data)
                setHorarios(response.data)
            }catch(err){
                console.log(err)
                setLoading(false)
            }finally {
            setLoading(false);
            }
        }
        getHorarios()
     },[barberShop?.id])

     async function handleCadastro(){
        setLoading(true)
        try{
            const response = await api.post('/horarios', {
                barbearia_id: barberShop.id,
                day_of_week: dayOfWeek,
                start_time: startTime,
                end_time: endTime,
                active: active,
            })
            setLoading(false)
            console.log(response.data)
        }catch(err){
            console.log(err)
            setLoading(false)
        }   
      }

      async function handleDelete(id: number){
        if(!id) return;
        setLoading(true)
        try{
            const response = await api.delete(`/deletehours/${id}`)
            setLoading(false)
            console.log(response.data)
        }catch(err){
            console.log(err)
            setLoading(false)
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
        <div className="w-full h-screen bg-[#28262e] text-white flex gap-2 p-6 max-sm:flex-col overflow-auto">
        
            <div className="w-[50%] max-sm:w-full  p-4  shadow shadow-white rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Cadastrar horário</h2>

            {/* Dia da semana */}
            <label className="block mb-2">
                <span className="text-gray-700">Dia da semana</span>
                <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                >
                <option className="bg-[#28262e] " value="1">Segunda-feira</option>
                <option className="bg-[#28262e] " value="2">Terça-feira</option>
                <option className="bg-[#28262e] " value="3">Quarta-feira</option>
                <option className="bg-[#28262e] " value="4">Quinta-feira</option>
                <option className="bg-[#28262e] " value="5">Sexta-feira</option>
                <option className="bg-[#28262e] " value="6">Sábado</option>
                <option className="bg-[#28262e] " value="7">Domingo</option>
                </select>
            </label>

            {/* Hora de abertura */}
            <label className="block mb-2">
                <span className="text-gray-700">Hora de abertura</span>
                <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                />
            </label>

            {/* Hora de fechamento */}
            <label className="block mb-2">
                <span className="text-gray-700">Hora de fechamento</span>
                <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                />
            </label>

            {/* Ativo */}
            <label className="flex items-center gap-2 mt-2">
                <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                />
                <span>Ativo</span>
            </label>

            {/* Botão salvar */}
            <button 
              onClick={handleCadastro}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded">
                Salvar
            </button>
            </div>
            <div className="w-[50%] max-sm:w-full p-4 flex flex-col gap-2 items-center  shadow rounded-2xls">
               <h2 className="text-xl font-bold mb-4  text-center">Horários cadastrados</h2>
                <ul>
                    {horarios.map((h) => (
                    <li
                    className="flex justify-arround items-center mb-2"
                     key={h.id}>
                       {diasDaSemana[h.day_of_week]}: {h.start_time} - {h.end_time}  <button
                       onClick={() => handleDelete(h.id)} 
                       className="px-2"><Trash2 color="#ff0000" size={20}/></button>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}