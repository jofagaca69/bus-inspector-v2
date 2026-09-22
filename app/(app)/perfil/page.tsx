import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { TarjetaFicha } from "@/components/perfil/tarjeta-ficha";
import { FormularioFicha } from "@/app/(app)/perfil/formulario-ficha";
import { FormularioDatosPerfil } from "@/app/(app)/perfil/formulario-datos";
import { FormularioContrasena } from "@/app/(app)/perfil/formulario-contrasena";

export default async function PaginaPerfil() {
  const perfil = await obtenerPerfil();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo titulo="Mi perfil" />

      <TarjetaFicha perfil={perfil} />

      <FormularioFicha ficha={perfil} />

      <FormularioDatosPerfil
        nombreCompleto={perfil.nombre_completo}
        telefono={perfil.telefono}
      />

      <FormularioContrasena />
    </div>
  );
}
