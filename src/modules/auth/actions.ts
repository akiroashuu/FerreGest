"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { validarLogin, type ErroresLogin } from "./schema";

export type EstadoLogin = {
  /** Mensaje general (credenciales incorrectas, cuenta desactivada…). */
  mensaje?: string;
  /** Mensajes por campo. */
  errores?: ErroresLogin;
  /** Se devuelve el correo para no obligar a escribirlo de nuevo. */
  correo?: string;
};

export async function iniciarSesion(
  _estadoPrevio: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const correoEnviado = String(formData.get("correo") ?? "");

  // 1. Validar en el servidor, aunque el navegador ya haya validado.
  const validacion = validarLogin({
    correo: correoEnviado,
    contrasena: String(formData.get("contrasena") ?? ""),
  });
  if (!validacion.ok) {
    return { errores: validacion.errores, correo: correoEnviado };
  }
  const { correo, contrasena } = validacion.datos;

  // 2. Autenticar con Supabase.
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });
  if (error || !data.user) {
    // Mismo mensaje para correo inexistente y contraseña errónea: no se
    // revela qué cuentas existen.
    return { mensaje: "Correo o contraseña incorrectos.", correo };
  }

  // 3. La cuenta debe tener un perfil activo.
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("activo")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!perfil?.activo) {
    await supabase.auth.signOut();
    return {
      mensaje:
        "Tu cuenta está desactivada. Pide a un administrador que la active.",
      correo,
    };
  }

  redirect("/");
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
