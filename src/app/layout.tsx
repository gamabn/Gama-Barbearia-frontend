import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from "react-toastify";
import { ContextProvider } from "../../Context";

export const metadata: Metadata = {
  title: "Sistema de Barbearias",
  description: "sistema de barbearias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return(
        <html lang="pt-br">
        <body> 
          <ContextProvider>  
              <ToastContainer/>
              {children}   
           </ContextProvider>     
        </body>
        </html>
    )
}
