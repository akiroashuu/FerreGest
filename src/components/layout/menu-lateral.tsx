"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU } from "./navegacion";

function estaActiva(ruta: string, actual: string) {
  return ruta === "/" ? actual === "/" : actual.startsWith(ruta);
}

/** Lista de enlaces del menú. Es componente de cliente para marcar la ruta activa. */
export function MenuLateral() {
  const rutaActual = usePathname();

  return (
    <ul className="flex flex-row flex-wrap gap-1 md:flex-col">
      {MENU.map((elemento) => {
        if (!elemento.disponible) {
          return (
            <li key={elemento.ruta}>
              <span
                aria-disabled="true"
                className="flex items-center justify-between gap-2 rounded-lg p-3 font-medium text-tenue"
              >
                {elemento.etiqueta}
                <span className="rounded-full bg-fondo px-2 py-0.5 text-xs">
                  Pronto
                </span>
              </span>
            </li>
          );
        }

        const activa = estaActiva(elemento.ruta, rutaActual);
        return (
          <li key={elemento.ruta}>
            <Link
              href={elemento.ruta}
              aria-current={activa ? "page" : undefined}
              className={`block rounded-lg p-3 ${
                activa
                  ? "bg-marca-suave font-semibold text-marca"
                  : "font-medium text-texto-suave hover:bg-fondo"
              }`}
            >
              {elemento.etiqueta}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
