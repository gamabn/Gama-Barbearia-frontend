"use client"
import Link from "next/link"
import { House,  CalendarDays  } from 'lucide-react';
import { useParams } from "next/navigation";

export  function Footer(){
    const params = useParams();
    const idBarber = params.idBarber as string;
    console.log(idBarber);
    return(
        <div 
        className="w-[50%] bg-gray-800/85 fixed bottom-0 mb-3 border-2 
        justify-between left-1/2 -translate-x-1/2
         border-white rounded-xl z-40 flex  h-[100px] 
          text-white  items-center 
          max-sm:w-[80%] max-sm:h-[60px]"> 
           <div className="w-[50%] flex justify-center items-center border-r-2 border-white  h-full rounded-l-xl">
                <Link href={`/clients/${idBarber}`}>
                <House size={30} color="#00ff"/>
                </Link>
           </div>

            <div className="w-[50%] flex justify-center items-center h-full rounded-r-xl">
               <Link href={`/clients/${idBarber}/components/agend`}>
                <CalendarDays size={30} color="#00ff"/>
                </Link>
            </div>
        </div>
    )
}