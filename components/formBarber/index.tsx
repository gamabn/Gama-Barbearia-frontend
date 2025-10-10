"use client"

import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdFileUpload } from "react-icons/md";
import { CircleUserRound } from "lucide-react";
import { Context } from "../../Context";
import { Input } from "../input"; // seu componente Input (veja exemplo abaixo)
import { BarberProps } from "@/app/types";
import Image from "next/image";
import { api } from "../../util/api";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";

const itemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().refine(
    (value) =>
      /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) ||
      /^\d{2}\s\d{9}$/.test(value) ||
      /^\d{11}$/.test(value),
    { message: "Telefone inválido (ex: (11)999999999 ou 11999999999)" }
  ),
  image: z.any().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

function BarberItemForm({ item }: { item: BarberProps }) {
  const [imagePreview, setImagePreview] = useState<string | null>(item.img_url ?? null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { id: item.id,
         name: item.name,
          phone: item.barber_phone,
           image: null },
  });

  useEffect(() => {
    // sempre que o item mudar (por exemplo vindo do contexto), atualiza o formulário
    reset({ id: item.id, name: item.name, phone: item.barber_phone , image: null});
    setImagePreview(item.img_url ?? null);
  }, [item, reset]);

  const handleEdit: SubmitHandler<ItemFormValues> = async (data) => {
    console.log('Dados',data)
    try {
      // monte o formData para enviar ao backend (ajuste a URL conforme seu endpoint)
      const fd = new FormData();
      fd.append("id", data.id?.toString() || "");
      fd.append("name", data.name);
      fd.append("phone", data.phone);
      if (data.image) fd.append("file", data.image);

      // exemplo de requisição: ajuste para PUT/POST e rota da sua API
     const res = await fetch(`/api/barber`, {
        method: "PUT",
        body: fd,
        
     })
     const saved = await res.json()
      
      toast.success("Salvo com sucesso!");
      
      // atualiza o formulário com o retorno do servidor
      reset({ id: saved.id ?? item.id, name: saved.name ?? data.name, phone: saved.phone ?? data.phone });
      if (saved.img_url) setImagePreview(saved.img_url);
      console.log("Salvo:", saved);
    } catch (err) {
      console.error("Erro no submit:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleEdit)} className="flex flex-col mt-5 p-4 border rounded mb-4">
      <label className="mb-1 text-lg font-medium">Nome</label>
      <Input type="text"  name="name" placeholder="Nome" register={register} error={errors.name?.message} />

      <label className="mb-1 text-lg font-medium">Telefone</label>
      <Input type="text"  name="phone" placeholder="Telefone" register={register} error={errors.phone?.message} />

      <label className="mb-1 text-lg text-center font-medium">Imagem</label>
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <label className="flex flex-col items-center justify-center">
            <span className="flex items-center justify-center mb-2">
              <MdFileUpload color="#0000FF" size={45} className="mr-2 z-99" />
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                field.onChange(file);
                if (file) setImagePreview(URL.createObjectURL(file));
              }}
             className="text-white hidden"
            />

            {imagePreview ? (
             <Image 
             alt="Logo" 
             src={imagePreview}
             width={150}
             height={150}
             priority
             className="object-cover w-[150px] h-[150px] mt-2 rounded-full"
              />
            ) : (
              <span>
                <CircleUserRound className="object-cover mt-2 h-[150px] w-[150px] rounded-full" />
              </span>
            )}
          </label>
        )}
      />
    
      <button type="submit" className="w-full h-11 p-2 mt-3 bg-[#00ff] text-white rounded">
        Salvar
      </button>
    </form>
  );
}

export function FormBarber() {
  const { barber } = useContext(Context);

  if (!barber) return <p>Carregando...</p>;
  if (!Array.isArray(barber)) return <p>Dados inesperados (esperado array)</p>;

  return (
    <>
      {barber.length === 0 && <p>Nenhum barbeiro cadastrado</p>}
      {barber.map((b: BarberProps) => (
        <BarberItemForm key={b.id} item={b} />
      ))}
    </>
  );
}
