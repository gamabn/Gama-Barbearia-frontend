
import { Header } from "../../../components/header"
import { AuthGuard } from "../../../components/AutGuard"

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>){
  
    return(
       <>
       <AuthGuard>
        <Header>
             {children}
        </Header>
    </AuthGuard>
       </>
    )
}