"use client"
import { useContext, useEffect } from "react"
import { Context } from "../../Context"
import { useRouter } from "next/navigation"


export function AuthGuard( {children}:{children: React.ReactNode  }){
    const router = useRouter()
    const {barberShop} = useContext(Context)

    useEffect(()=>{
    if(!barberShop){
       router.push('/')     
    }

    },[barberShop, router])

   
    return  barberShop ? <>{children}</> : null

    
}