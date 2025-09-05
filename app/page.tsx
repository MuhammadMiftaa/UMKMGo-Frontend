import App from "../src/App"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../src/contexts/AuthContext"
import "../src/globals.css"

export default function Page() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  )
}
