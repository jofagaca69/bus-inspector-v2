import Link from "next/link";

/** Cabecera común a los módulos académicos y de perfil/contacto/acerca de. */
export function CabeceraModulo({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Link
        href="/inicio"
        className="w-fit text-sm text-texto-suave hover:text-texto"
      >
        ‹ Inicio
      </Link>
      <h1 className="text-lg font-semibold">{titulo}</h1>
      {subtitulo && <p className="text-sm text-texto-suave">{subtitulo}</p>}
    </div>
  );
}
