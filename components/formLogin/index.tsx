"use client"
import { useForm } from "react-hook-form"
import {  email, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "../input"
import Link from "next/link"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "A senha é obrigatória"),
})

// Usamos uma união dos dois schemas para o tipo
type FormValues = z.infer<typeof loginSchema>

interface FormProps {
  title: string;
  setLoading: (loading: boolean) => void;
}


export function FormLogin({title, setLoading}: FormProps){
     const router = useRouter()
   
        const {register, handleSubmit,control, formState: {errors}} = useForm<FormValues>({
            // Escolhe o schema de validação com base no título do formulário
            resolver: zodResolver(loginSchema)
        })

   const handleLogin = async (data: FormValues) => {

        setLoading(true)

        try{
            const email = data.email
            const senha = data.senha

            console.log(email, senha)


            const response = await fetch("/api/login", {
                body: JSON.stringify({email, password:senha}),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },        
            })

            if(response.ok){
                router.push("/dashboard") // ou para a página que desejar
                //toast.success("Login feito com sucesso!")
            
                return
            }

            const errorData = await response.json()
            toast.error(errorData.message || "Erro ao fazer login.")

        }catch(error){
            console.log(error)
            toast.error("Ocorreu um erro inesperado. Tente novamente.")
        }finally{
            setLoading(false)
        }

    }

   return(
    <form
         onSubmit={handleSubmit(handleLogin)}
         className="w-[75%] flex flex-col max-h-[350px]  mt-5 overflow-auto rounded-md bg-white p-3 max-sm:w-[90%]"
         >
          <h1 className="text-center text-2xl font-bold mb-3 text-black max-sm:text-lg">
            {title}
            </h1>

          <label>
            Email
            </label>

         <Input
            type="email"
            name="email"
            placeholder="Digite seu email"
            register={register}
            error={errors.email?.message}
            />
         
          <label htmlFor="">Senha</label>

          <Input 
            type="password"
            name="senha"
            placeholder="Digite sua senha"
            register={register}
            error={errors.senha?.message}
            />
          <button
          type="submit"
          className="w-full h-11 p-2 mt-2 text-lg font-bold bg-[#00ff] cursor-pointer"
          >Entrar</button>
          
            <Link 
            href="/cadastro"
            className="text-sm text-center font-extralight text-[#2323da] py-3 hover:underline cursor-pointer "
            >
            Se nao tem conta? Cadastre-se
            </Link>
         </form>
   )

}