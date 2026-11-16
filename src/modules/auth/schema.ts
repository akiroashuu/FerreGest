import { z } from "zod";

/** Reglas del formulario de inicio de sesión. Se usan en cliente y servidor. */
export const esquemaLogin = z.object({
  correo: z
    .string()
    .trim()
    .min(1, "Escribe tu correo.")
    .pipe(z.email("El correo no tiene un formato válido.")),
  contrasena: z.string().min(1, "Escribe tu contraseña."),
});

export type DatosLogin = z.infer<typeof esquemaLogin>;

export type ErroresLogin = Partial<Record<keyof DatosLogin, string>>;

/** Convierte el resultado de Zod en un mensaje por campo. */
export function validarLogin(
  datos: unknown,
): { ok: true; datos: DatosLogin } | { ok: false; errores: ErroresLogin } {
  const resultado = esquemaLogin.safeParse(datos);
  if (resultado.success) {
    return { ok: true, datos: resultado.data };
  }
  const errores: ErroresLogin = {};
  for (const problema of resultado.error.issues) {
    const campo = problema.path[0];
    if ((campo === "correo" || campo === "contrasena") && !errores[campo]) {
      errores[campo] = problema.message;
    }
  }
  return { ok: false, errores };
}
