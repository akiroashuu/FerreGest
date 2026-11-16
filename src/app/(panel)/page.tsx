import type { Metadata } from "next";
import { Aviso } from "@/components/ui/aviso";
import { obtenerPerfil } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Inicio",
};

export default async function PaginaInicio() {
  const perfil = await obtenerPerfil();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-bold">Hola, {perfil.nombre}</h1>
      <Aviso tipo="info">
        El sistema está en construcción. Aquí aparecerán las ventas del día y
        los productos con stock bajo cuando esos módulos estén listos.
      </Aviso>
    </div>
  );
}
