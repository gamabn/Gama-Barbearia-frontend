"use client"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "../input"
import { useEffect, useState, useContext } from "react"
import { Controller } from "react-hook-form"
import { MdFileUpload } from "react-icons/md";
import { CircleUserRound } from 'lucide-react';
import { Context } from "../../Context"
import Image from "next/image"

const schema = z.object({
    id: z.number().optional(),
    name: z.string().min(1,"Nome é obrigatório"),
    phone: z
        .string()
        .refine(
            (value) =>
            /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || // (DD) 999999999
            /^\d{2}\s\d{9}$/.test(value) || // DD 999999999
            /^\d{11}$/.test(value), // 11999999999
            {
            message: "O número de telefone deve estar no formato (DD) 999999999 ou similar.",
            }
        ),
   image: z.any().optional()

})

type FormValues = z.infer<typeof schema>




export function Form(){
    const [image, setImage] = useState<File | null>(null)
    const {RegisterBarber} = useContext(Context)

    const {register, handleSubmit,control, formState: {errors}, reset} = useForm<FormValues>({
        resolver: zodResolver(schema)
    })

   const handleRegister = async (data: FormValues) => {
       // console.log(data)
       await RegisterBarber(data)
       reset()
       setImage(null)

    }   
        
    //if(id){
   //    useEffect(()=>{

     //  },[id])
   // }

    return(
        <form
        onSubmit={handleSubmit(handleRegister)}
           className="flex flex-col mt-5 border p-3">
            <label className="mb-1 text-lg font-medium"> Nome</label>
             <Input 
             type="text"
             name="name"
             placeholder="Nome"
             register={register}
             error={errors.name?.message}
            
             />    

           
            <label className="mb-1 text-lg font-medium">Telefone</label>
             <Input 
             type="text"
             name="phone"
             placeholder="Digite seu telefone"
             register={register}
             error={errors.phone?.message}
            />  

              <label className="mb-1 text-lg text-center font-medium">Imagem</label>

             <Controller
                name="image"
                control={control} // adicione control no useForm: const {control, handleSubmit} = useForm(...)
                render={({ field }) => (
                 <label className="flex flex-col items-center justify-center ">
                    
                    <span className="flex items-center justify-center mb-2">
                        <MdFileUpload color="#0000FF" size={45} className="mr-2 z-99"/>
                    </span>
                    <input                     
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file); // atualiza RHF
                        setImage(file);       // atualiza preview
                        }}
                        className="text-white hidden"
                    />

                    {image ?(
                        <Image
                        width={150}
                        height={150} 
                        priority={true} 
                        src={URL.createObjectURL(image)} 
                     alt="Preview"
                     className=" object-cover  h-[150px] w-[150px] mt-2 rounded-full"/>
                    ):(
                      <span>
                        <CircleUserRound 
                        className="obct-cover mt-2 h-[150px] w-[150px] rounded-full"/>
                      </span>
                    )
                     
                     }
                    </label>
                )}
                />
           
            <button
            className="w-full h-11 p-2 m-3 bg-[#00ff]"
            >
                Enviar
                </button>                 
        </form>
    )
}