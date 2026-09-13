import { obtenerPerfil } from "@/lib/auth/dal";

export default async function PaginaInicio() {
  const perfil = await obtenerPerfil();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-6">
      <div>
        <h1 className="text-lg font-semibold">
          Hola, {perfil.nombre_completo || perfil.cedula}
        </h1>
        <p className="text-sm text-foreground/60">
          Cédula {perfil.cedula} · {perfil.rol === "admin" ? "Administrador" : "Conductor"}
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-black/15 p-6 text-center text-sm text-foreground/60 dark:border-white/15">
        Aquí irá la inspección preventiva diaria del bus.
      </div>
    </div>
  );
}
