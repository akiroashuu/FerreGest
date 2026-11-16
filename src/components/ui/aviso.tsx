import type { ReactNode } from "react";

type Tipo = "error" | "aviso" | "info";

const ESTILOS: Record<Tipo, string> = {
  error: "bg-error-fondo text-error-texto",
  aviso: "bg-aviso-fondo text-aviso-texto",
  info: "bg-marca-suave text-marca-oscura",
};

/**
 * Mensaje destacado. Los errores usan role="alert" para que un lector de
 * pantalla los anuncie en cuanto aparecen.
 */
export function Aviso({
  tipo = "info",
  children,
}: {
  tipo?: Tipo;
  children: ReactNode;
}) {
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded-lg px-4 py-3 text-sm font-medium ${ESTILOS[tipo]}`}
    >
      {children}
    </div>
  );
}
