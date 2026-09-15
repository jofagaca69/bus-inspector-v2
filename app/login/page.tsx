import { redirect } from "next/navigation";
import { obtenerUsuario } from "@/lib/auth/dal";
import { FormularioLogin } from "@/app/login/formulario-login";

export default async function PaginaLogin() {
  const user = await obtenerUsuario();

  if (user) {
    redirect("/inicio");
  }

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-texto">
            Cootranszipa
          </h1>
          <p className="mt-1 text-sm text-texto-suave">
            Inspección preventiva de buses
          </p>
        </div>

        <FormularioLogin />
      </div>
    </main>
  );
}
