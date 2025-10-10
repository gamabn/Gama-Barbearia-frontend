"use client"
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps{
    placeholder: string;
    type: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
   // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;


   

}
export function Input({placeholder, type, name, register, error, rules}: InputProps){
    return(
        <>
        <input
        className="w-full border-1 text-lg text-gray-600 rounded-md h-11 mb-3 p-2 max-sm:text-sm"
        placeholder={placeholder}
        type={type}   
       // onChange={onChange}    
        {...register(name, rules)}
        id={name}
        />
        {error && <span className="text-red-500 my-1">{error}</span>}
        </>
    )
}