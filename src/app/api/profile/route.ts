import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../util/api";

export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    (await cookieStore).delete("token");
    return NextResponse.json({ message: "Logged out" }, { status: 200 });

}

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    }

   try{
    const response = await api.get("/user/detail", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return NextResponse.json(response.data);
   }catch(err){

    console.log(err)
    
    return NextResponse.json({ message: "Erro interno no servidor."}, { status: 500})
   
   }
}