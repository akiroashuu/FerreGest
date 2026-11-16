import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  /** Identificador único; enlaza la etiqueta, el campo y el error. */
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
};

/** Campo de formulario con etiqueta visible y mensaje de error accesible. */
export function Campo({
  id,
  etiqueta,
  error,
  ayuda,
  className = "",
  ...resto
}: Props) {
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;
  const descritoPor =
    [error ? idError : null, ayuda ? idAyuda : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={descritoPor}
        className={`h-12 w-full rounded-lg border bg-superficie px-3 text-base placeholder:text-tenue ${error ? "border-error-texto" : "border-borde-fuerte"} ${className}`}
        {...resto}
      />
      {ayuda && !error ? (
        <p id={idAyuda} className="text-sm text-tenue">
          {ayuda}
        </p>
      ) : null}
      {error ? (
        <p id={idError} className="text-sm font-medium text-error-texto">
          {error}
        </p>
      ) : null}
    </div>
  );
}
