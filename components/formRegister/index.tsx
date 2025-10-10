"use client"
import { useForm } from "react-hook-form"
import { email, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "../input"
import { useState } from "react"
import { Controller } from "react-hook-form"
import { MdFileUpload } from "react-icons/md";
import { CircleUserRound } from 'lucide-react';
import { api } from "../../util/api"
import Link from "next/link"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

const registerSchema = z.object({
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
   image: z.any().optional(),
   email: z.string().email("Email inválido"),
   city: z.string().min(1,"Cidade é obrigatória"),
   bairro: z.string().min(1,"Bairro é obrigatório"),
   rua: z.string().min(1,"Rua é obrigatória"),
   numero: z.string().min(1,"Número é obrigatório"),
   senha: z.string().min(1,"Senha é obrigatória"),
   confirmarSenha: z.string().min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
      }).refine((data) => data.senha === data.confirmarSenha, {
          message: "As senhas não coincidem",
          path: ["confirmarSenha"], // Campo onde o erro será exibido
      })



// Usamos uma união dos dois schemas para o tipo
type FormValues = z.infer<typeof registerSchema>;

interface FormProps {
  title: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}


export function FormRegister({title, setLoading, loading}: FormProps){
    const router = useRouter()
    const [image, setImage] = useState<File | null>(null)
    const {register, handleSubmit,control, formState: {errors}} = useForm<FormValues>({
        // Escolhe o schema de validação com base no título do formulário
        resolver: zodResolver(registerSchema)
    })

    const handleRegister = async (data: FormValues) => {
       setLoading(true)
       try{
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("phone", data.phone)
        formData.append("email", data.email)
        formData.append("city", data.city)
        formData.append("neighborhood", data.bairro);
        formData.append("street", data.rua); 
        formData.append("number", data.numero)
        formData.append("password", data.senha);
       

        if (data.image) {
          formData.append("file", data.image);
        }

       const response = await api.post("/user", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
         console.log("Cadastro feito:", response.data);
         toast.success("Cadastro feito com sucesso!")

       }catch(error){
        console.log(error)
        toast.error("Erro ao cadastrar")
       }finally{
        setLoading(false)
       }
    }

   
    if(loading){
        return(
            <div className="w-full flex flex-col h-screen bg-[#fff] text-white justify-center items-center ">
                <h1>Carregando...</h1>
                <Loader 
                className="animate-spin"
                color="#00ff"/>
            </div>
        )
    }

    return(
        <>
         <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col h-[90%] w-[90%] mt-5 overflow-auto rounded-md bg-white p-3">

                <h1 className="text-center text-2xl font-bold mb-3 text-black max-sm:text-lg">{title}</h1>

                <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm"> Nome</label>
                <Input 
                type="text"
                name="name"
                placeholder="Nome"
                register={register}
                error={errors.name?.message}
                />    

              
                <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Telefone</label>
                <Input 
                type="text"
                name="phone"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.phone?.message}
                />  
                  <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Email</label>
                <Input 
                type="text"
                name="email"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.email?.message}
                />  
                  <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Cidade</label>
                <Input 
                type="text"
                name="city"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.city?.message}
                />  
                  <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Bairro</label>
                <Input 
                type="text"
                name="bairro"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.bairro?.message}
                />  
                  <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Rua</label>
                <Input 
                type="text"
                name="rua"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.rua?.message}
                />  

                <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Numero</label>
                <Input 
                type="text"
                name="numero"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.numero?.message}
                />  

                  <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Senha</label>
                <Input 
                type="text"
                name="senha"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.senha?.message}
                />  

                  <label className="mb-1 text-lg font-medium text-gray-700 max-sm:text-sm">Confirmar senha</label>
                <Input 
                type="text"
                name="confirmarSenha"
                placeholder="Digite seu telefone"
                register={register}
                error={errors.confirmarSenha?.message}
                />  

                  <label className="mb-1 text-lg text-center font-medium text-gray-700 max-sm:text-sm">Imagem</label>

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
                            <img src={URL.createObjectURL(image)} 
                        alt="Preview"
                        className=" object-cover mt-2 h-[150px] w-[150px] rounded-full"/>
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
            type="submit"
            className="w-full h-11 p-2 mt-2 text-lg font-bold  bg-[#00ff] cursor-pointer"
            >
               {loading ? 'Carregando...' : 'Cadastrar'}
                </button>

                <Link 
                className='text-sm text-center text-[#2323ba] py-3 hover:underline cursor-pointer mt-3'
                href='/login'>
                Se ja tem conta? Entrar
                </Link>                 
        </form>
       
       </>
    )
}