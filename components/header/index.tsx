"use client"
import Link from "next/link"
import { House, Scissors,  Power, Menu, ChartLine, CalendarClock, UserPlus ,  ClockPlus } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Context } from "../../Context";
import Image from "next/image";

export function Header({children}: {children: React.ReactNode  }){
   const [active, setActive] = useState<boolean>(false)
   const router = useRouter()
   const { barberShop } = useContext(Context)


   async function handleLogout(){
      try{
         const res = await fetch('/api/profile',{
            method: 'DELETE',
         })

         if(res.ok){
            router.push('/')
         }

      }catch(err){
         console.log(err)
      }  
   }
      
    return(
      <div className="h-screen w-full">    
        <div className="w-full h-[80px] border-b p-3 bg-[#28262e] border-black text-white flex justify-between items-center">
           <div>
            <h1 className="flex">
              {barberShop?.image_url && (
               <Image
                  className="h-8 w-8 rounded-full mr-2"
                  src={barberShop.image_url}
                  width={50}
                  height={50}
                  priority
                  alt="logo"
               />
               )}
                 {barberShop?.name}
             </h1>
             
           </div>
           <div className="flex gap-3">
            <div>
               <button
               className="hover:bg-black p-2 rounded-full"
                onClick={() => setActive(!active)}>
                  <Menu/>
               </button>
             </div>
              <div className={` gap-3 fixed top-0 right-0 items-center bg-black flex flex-col transform transition-transform duration-300 ${active ? 'translate-x-0' : 'translate-x-full'} h-screen w-[120px] max-sm:w-[80px]` }>
                      <button 
                      className="mt-5 hover:bg-[#00ff] p-2 rounded-full"
                      onClick={() => setActive(!active)}
                      >
                        <Menu/>
                     </button>
                     <Link href="#">
                        <p><House /></p>
                     </Link>

                     <Link href="/dashboard/register">
                        <UserPlus />
                     </Link>

                     <Link href="/dashboard/service">
                        <Scissors />
                     </Link>

                     <Link href="/dashboard/clock">
                        < ClockPlus />
                     </Link>

                     <Link href="#">
                     <p><ChartLine /></p>
                     </Link>
                     
                     <Link href="#">
                        <p><CalendarClock /></p>
                     </Link>
                     <button 
                     onClick={handleLogout}>
                        <Power  color='#eb0000'/>
                     </button>
               </div>
         
           </div>
              
        </div>

        <div className="flex-1 flex flex-col ">
            {children}
         </div>

        </div>
       
    )
}