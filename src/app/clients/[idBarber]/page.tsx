"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../../util/api";
import { BarberShopProps, BarberProps, Service } from "@/app/types";
import { Loader, Scissors } from "lucide-react";
import Image from "next/image";
import { Footer } from "./components/footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Mantido para estilização
import { LoginClient } from "./components/loginCliente";
import { toast} from "react-toastify";
import { set } from "zod";

// Tipagem para o horário de funcionamento
type OpeningHours = {
  day: number;    // 0=domingo ... 6=sábado
  open: string;   // "HH:MM"
  close: string;  // "HH:MM"
};

export default function Clients() {
  const params = useParams();
  const idBarber = params.idBarber as string;

  const [barberShop, setBarberShop] = useState<BarberShopProps>();
  const [barber, setBarber] = useState<BarberProps[]>([]);
  const [barberOne, setBarberOne] = useState<BarberProps>({
    id: "",
    name: "",
    barber_phone: "",
    img_url: "",
    public_id: "",
    barbearia_id: "",
  });
  const [serviceOne, setServiceOne] = useState<Service[]>([]);
  const [dataHora, setDataHora] = useState<Date>(new Date());
  const [service, setService] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [erroHorario, setErroHorario] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<OpeningHours[]>([]);
  const [phone, setPhone] = useState('');
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [horariosOcupados, setHorariosOcupados] = useState<any[]>([]);
  const [client, setClient] = useState({
    id:'',
    name:'',
    phone:''
  });



  useEffect(() => {
    if (!idBarber) return;

    async function init() {
      await Promise.all([getBarberShop(), getHorarios(), getBarbers(), storage(),getAgendamentos()]);
      setLoading(false);
    }

    init();
  }, [idBarber]);

  useEffect(() => {
  if (agendamentos.length > 0) {
    const ocupados = agendamentos.map((a) => {
      const start = new Date(a.date_agend);
      const end = new Date(start.getTime() + a.duration_total.minutes * 60000);
      return { start, end };
    });
    setHorariosOcupados(ocupados);
  }
}, [agendamentos]);


  async function getBarberShop() {
    try {
      const { data } = await api.get(`/user/${idBarber}`);
      setBarberShop(data);
    } catch (err) {
      console.error(err);
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

  async function getBarbers() {
    try {
      const { data } = await api.get(`/barber/many/${idBarber}`);
      setBarber(data);
    } catch (err) {
      console.error(err);
    }
  }

  async  function getAgendamentos(){
    try {
      const { data } = await api.get(`/agendamento/${idBarber}`);
      console.log('agendamentos carregados',data);
      setAgendamentos(data);
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

  async function getHorarios() {
    try {
      const { data } = await api.get(`/horarios/${idBarber}`);
      const mapped: OpeningHours[] = data
        .filter((h: any) => h.active)
        .map((h: any) => ({
          day: h.day_of_week,
          open: h.start_time.slice(0, 5),
          close: h.end_time.slice(0, 5),
        }));
      setHorarios(mapped);
      console.log('horarios carregados',mapped);
    } catch (err) {
      console.error(err);
    }
  }

  function pad(n: number) {
    return String(n).padStart(2, "0");
  }

  const formatDateForDisplay = (d: Date) =>
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
     const formatTimeForDisplay = (d: Date) =>
    `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  function toPostgresTimestamptz(date: Date) {
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? "+" : "-";
    const abs = Math.abs(tzOffset);
    const hours = pad(Math.floor(abs / 60));
    const minutes = pad(abs % 60);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00${sign}${hours}:${minutes}`;
  }

  function isWithinOpeningHours(date: Date, hours: OpeningHours[]) {
    const day = date.getDay();
    const found = hours.find((h) => h.day === day);
    if (!found) return false;
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return time >= found.open && time <= found.close;
  }

  async function handleConfirmarAgendamento() { 

        setLoading(true)

        if (!isWithinOpeningHours(dataHora, horarios)) {                      
          setErroHorario("O horário selecionado está fora do funcionamento da barbearia.");
          return;
        }

        if (!client.id) {
          setErroHorario("Cliente não identificado. Faça o login novamente.");
          return;
        }
        if (!barberOne.id) {
          setErroHorario("Por favor, selecione um barbeiro.");
          return;
        }
        if (serviceOne.length === 0) {
          setErroHorario("Por favor, selecione pelo menos um serviço.");
          return;
        }

        const formattedDate = toPostgresTimestamptz(dataHora);
        console.log("Horario agendado", formattedDate);

        try {
          const response = await api.post('/agend', {
            client_id: client.id,
            barber_id: barberOne.id,
            service_ids: serviceOne.map((s) => s.id),
            date_agend: formattedDate // Usando a data formatada
          })
          setLoading(false)
          setServiceOne([])
          setDataHora(new Date())
          toast.success('Agendamento realizado com sucesso')
       // console.log('agendamento realizado',response.data)
        }catch(err){
          console.log(err)
          setLoading(false)
          toast.error('Erro ao agendar')
        }
        setErroHorario(null);
        setServiceOne([]);
        setDataHora(new Date());
      }

  if (loading) {
    return (
      <div className="w-full flex flex-col h-screen bg-[#28262e] text-white justify-center items-center">
        <h1>Carregando...</h1>
        <Loader className="animate-spin" color="#00ff" />
      </div>
    );
  }

      const selectedDay = dataHora.getDay();
      const horarioDoDia = horarios.find(h => h.day === selectedDay);

      const minTime = horarioDoDia
      ? new Date(dataHora.getFullYear(), dataHora.getMonth(), dataHora.getDate(), Number(horarioDoDia.open.split(":")[0]), Number(horarioDoDia.open.split(":")[1]))
      : new Date(0,0,0,0,0);

      const maxTime = horarioDoDia
      ? new Date(dataHora.getFullYear(), dataHora.getMonth(), dataHora.getDate(), Number(horarioDoDia.close.split(":")[0]), Number(horarioDoDia.close.split(":")[1]))
      : new Date(0,0,0,23,59);

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#28262e] text-white">
      <LoginClient />

      <main className="flex-grow flex flex-col items-center justify-start w-full p-4 md:p-6 lg:p-8 mb-[50px]">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2">
          <Scissors size={40} />
          <h1 className="text-2xl font-bold max-sm:text-md max-sm:font-light">
            Bem-vindo à <span className="text-[#00ff]">{barberShop?.name}</span>
          </h1>

          {barberShop?.image_url && (
            <Image
              width={50}
              height={50}
              src={barberShop.image_url}
              className="w-[50px] h-[50px] object-cover rounded-full"
              alt="logo"
            />
          )}
        </div>

        <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col gap-12">
          {/* Passo 1: Barbeiros */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold border-l-4 border-[#00ff] pl-3">1. Escolha o profissional</h2>
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

          {/* Passo 2: Serviços */}
          {service.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold border-l-4 border-[#00ff] pl-3">2. Escolha o(s) serviço(s)</h2>
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

          {/* Passo 3: DatePicker + Resumo */}
          {serviceOne.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold border-l-4 border-[#00ff] pl-3">3. Escolha a data e hora</h2>
              <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-8 mt-4">
                <div className="w-full lg:w-auto flex justify-center">
                  <DatePicker
                            selected={dataHora}
                            onChange={(date) => setDataHora(date!)}
                            showTimeSelect
                            inline
                            timeFormat="HH:mm"
                            timeIntervals={
                              serviceOne.length > 0
                                ? serviceOne.reduce((acc, s) => acc + (s.duration.minutes || 0), 0)
                                : 15
                            }
                            minDate={new Date()}
                            filterDate={(date) => horarios.some(h => h.day === date.getDay())}
                            filterTime={(time) => {
                              const selectedDay = time.getDay();
                              const horario = horarios.find(h => h.day === selectedDay);
                              if (!horario) return false;

                              // horários de abertura/fechamento
                              const [openHour, openMinute] = horario.open.split(":").map(Number);
                              const [closeHour, closeMinute] = horario.close.split(":").map(Number);

                              const openTime = new Date(time);
                              openTime.setHours(openHour, openMinute, 0, 0);

                              const closeTime = new Date(time);
                              closeTime.setHours(closeHour, closeMinute, 0, 0);

                              // bloqueia horários passados
                              if (time < new Date()) return false;

                              // bloqueia horários ocupados
                              for (const ag of horariosOcupados) {
                                if (time >= ag.start && time < ag.end) return false;
                              }

                              return time >= openTime && time <= closeTime;
                            }}
                          />
                
                </div>

                <div className="w-full lg:max-w-sm text-base bg-[#1e1c24] border border-gray-700 p-6 rounded-lg flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-center mb-2">Resumo do Agendamento</h3>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cliente:</span>
                    <span className="font-semibold">{client.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profissional:</span>
                    <span className="font-semibold">{barberOne.name}</span>
                  </div>
                  
                  <hr className="border-gray-600" />

                  <div>
                    <span className="text-gray-400">Serviços:</span>
                    {serviceOne.map((s) => (
                      <div key={s.id} className="flex justify-between items-center mt-1">
                        <span>{s.name}</span>
                        <span className="font-semibold">{s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-600" />

                  <div className="text-center bg-gray-800/50 p-3 rounded-md">
                    <p className="font-bold text-lg">{formatDateForDisplay(dataHora)}</p>
                    <p className="text-2xl font-bold text-[#00ff]">{formatTimeForDisplay(dataHora)}</p>
                  </div>

                  <button
                    onClick={handleConfirmarAgendamento}
                    className="mt-4 w-full px-4 py-3 bg-green-600 rounded-lg text-center font-bold text-lg hover:bg-green-700 transition-colors"
                  >
                    Confirmar Agendamento
                  </button>

                  {erroHorario && (
                    <p className="text-red-500 text-center mt-2">{erroHorario}</p>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
