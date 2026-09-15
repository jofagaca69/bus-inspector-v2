import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { FormularioDatosPerfil } from "@/app/(app)/perfil/formulario-datos";
import { FormularioContrasena } from "@/app/(app)/perfil/formulario-contrasena";

export default async function PaginaPerfil() {
  const perfil = await obtenerPerfil();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo titulo="Mi perfil" />

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <p className="text-xs text-texto-suave">Cédula</p>
        <p className="text-sm font-medium">{perfil.cedula}</p>
        <p className="mt-2 text-xs text-texto-suave">Rol</p>
        <p className="text-sm font-medium">
          {perfil.rol === "admin" ? "Administrador" : "Conductor"}
        </p>
      </div>

      <FormularioDatosPerfil
        nombreCompleto={perfil.nombre_completo}
        telefono={perfil.telefono}
      />

      <FormularioContrasena />
    </div>
  );
}
