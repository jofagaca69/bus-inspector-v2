import { obtenerPerfil } from "@/lib/auth/dal";
import { itemsParaRol } from "@/lib/navegacion";
import { TarjetaModulo } from "@/components/ui/tarjeta-modulo";

export default async function PaginaInicio() {
  const perfil = await obtenerPerfil();
  const items = itemsParaRol(perfil.rol);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-lg font-semibold">
          Hola, {perfil.nombre_completo || perfil.cedula}
        </h1>
        <p className="text-sm text-texto-suave">
          Cédula {perfil.cedula} · {perfil.rol === "admin" ? "Administrador" : "Conductor"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <TarjetaModulo key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
