import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "discreto";

const ESTILOS: Record<Variante, string> = {
  primario:
    "bg-marca text-white hover:bg-marca-oscura disabled:bg-borde-fuerte disabled:text-tenue",
  secundario:
    "border border-marca bg-superficie text-marca hover:bg-marca-suave disabled:border-borde-fuerte disabled:text-tenue",
  discreto:
    "text-texto-suave hover:bg-fondo disabled:text-tenue",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  anchoCompleto?: boolean;
};

/** Botón base. Altura mínima de 44 px para que sea fácil de pulsar. */
export function Boton({
  variante = "primario",
  anchoCompleto = false,
  className = "",
  type = "button",
  ...resto
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold transition-colors disabled:cursor-not-allowed ${ESTILOS[variante]} ${anchoCompleto ? "w-full" : ""} ${className}`}
      {...resto}
    />
  );
}
