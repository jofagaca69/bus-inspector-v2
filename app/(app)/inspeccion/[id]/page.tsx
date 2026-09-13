import { notFound, redirect } from "next/navigation";
import { obtenerPerfil } from "@/lib/auth/dal";
import {
  obtenerBusesActivos,
  obtenerInspeccionPorId,
  obtenerItemsDeInspeccion,
} from "@/lib/inspeccion/consultas";
import { InspeccionEnCurso } from "@/components/inspeccion/inspeccion-en-curso";

export default async function PaginaInspeccionDetalle({
  params,
}: PageProps<"/inspeccion/[id]">) {
  const { id } = await params;
  const perfil = await obtenerPerfil();

  const inspeccion = await obtenerInspeccionPorId(id);
  if (!inspeccion) notFound();
  // RLS ya impide leer la inspección de otro conductor (la consulta
  // devuelve null); se verifica también aquí para un mensaje claro si
  // algún día la consulta cambiara de cliente.
  if (inspeccion.conductor_id !== perfil.id) notFound();

  if (inspeccion.finalizada_en) {
    redirect(`/historial/${inspeccion.id}`);
  }

  const [items, buses] = await Promise.all([
    obtenerItemsDeInspeccion(id),
    obtenerBusesActivos(),
  ]);

  return (
    <InspeccionEnCurso
      inspeccion={inspeccion}
      itemsIniciales={items}
      conductorId={perfil.id}
      busesActivos={buses}
    />
  );
}
