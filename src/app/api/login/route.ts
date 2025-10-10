import { NextResponse, NextRequest } from "next/server";
import { api } from "../../../../util/api";
import { cookies } from "next/headers";


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log(email, password);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    const response = await api.post("/login", { email, password });

    if (!response.data.token) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 400 }
      );
    }

    const maxAgeSeconds = 60 * 60 * 24 * 30;

    // 🔥 Criar a resposta
    const res = NextResponse.json({ success: true });

    // 🔥 Setar o cookie na resposta
    res.cookies.set("token", response.data.token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: maxAgeSeconds,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
