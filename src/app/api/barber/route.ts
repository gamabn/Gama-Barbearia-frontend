import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../../../util/api";
import FormData from "form-data"

export async function POST(request: NextRequest) {
     const cookieStore = await cookies();
     const token = cookieStore.get("token")?.value;

    const formdata = await request.formData();
    const name = formdata.get("name");
    const phone = formdata.get("phone")
    const image = formdata.get("file") as File;

    if(!name || !phone || !image ){
        return NextResponse.json({ message: "Preencha todos os campos"}, { status: 400})
    }
   
    try{
        const formBarber = new FormData();
        formBarber.append("name", name.toString())
        formBarber.append("barber_phone", phone)
       
        formBarber.append(
            "file",Buffer.from(await image.arrayBuffer()),
           {
            contentType: image.type,
            filename: image.name
           }
    );
   const response = await api.post('/barber',formBarber, {
     headers:{
        ...formBarber.getHeaders(),
        Authorization:`Bearer ${token}`
     }
   })
   return NextResponse.json(response.data)

    }catch(err){
        console.log(err)
        return NextResponse.json({ message: "Erro interno no servidor."}, { status: 500})
    }


}

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
 // console.log('Token do barbeiro',token)

  if (!token) {
    return NextResponse.json(
      { message: "Credenciais inválidas: token não encontrado" },
      { status: 401 }
    );
  }

  try {
    const response = await api.get("/barberall", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Erro na rota /api/barber:", err.response?.data || err.message);

   
    return NextResponse.json(
      {
        message: "Erro ao buscar barbeiros",
        details: err.response?.data || err.message,
      },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const formdata = await request.formData();
  const id = formdata.get("id");
  const name = formdata.get("name");
  const phone = formdata.get("phone")
  const image = formdata.get("file") as File;

  try{
    const formBarber = new FormData();
    formBarber.append("id", id)
    formBarber.append("name", name)
    formBarber.append("barber_phone", phone)
    formBarber.append("file",image)

    const response = await api.put(`/editbarber/${id}`,formBarber, {
      headers:{ 
        ...formBarber.getHeaders(),
        Authorization:`Bearer ${token}`
    }
    })
    return NextResponse.json(response.data)
      
  }catch(err){
    NextResponse.json({ message: "Erro interno no servidor."}, { status: 500})

  }
}

