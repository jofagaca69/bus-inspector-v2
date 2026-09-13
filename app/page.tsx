import { redirect } from "next/navigation";
import { obtenerUsuario } from "@/lib/auth/dal";

export default async function Home() {
  const user = await obtenerUsuario();
  redirect(user ? "/inicio" : "/login");
}
