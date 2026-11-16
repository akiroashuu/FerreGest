import { cache } from "react";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { esRol, type Rol } from "@/modules/auth/roles";

export type Perfil = {
  id: string;
  nombre: string;
  rol: Rol;
};

/**
 * Devuelve el perfil del usuario con sesión, o redirige a /login.
 * Úsalo al inicio de cada página y acción del panel.
 *
 * `cache` evita repetir la consulta dentro de una misma petición.
 */
export const obtenerPerfil = cache(async (): Promise<Perfil> => {
  const supabase = await crearClienteServidor();

  const { data: sesion } = await supabase.auth.getClaims();
  const idUsuario = sesion?.claims?.sub;
  if (!idUsuario) {
    redirect("/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombre, rol, activo")
    .eq("id", idUsuario)
    .maybeSingle();

  if (!perfil || !perfil.activo || !esRol(perfil.rol)) {
    // Sesión válida pero sin perfil utilizable: se cierra y vuelve al login.
    await supabase.auth.signOut();
    redirect("/login");
  }

  return { id: perfil.id, nombre: perfil.nombre, rol: perfil.rol };
});

/** Igual que obtenerPerfil, pero exige uno de los roles indicados. */
export async function exigirRol(...roles: Rol[]): Promise<Perfil> {
  const perfil = await obtenerPerfil();
  if (!roles.includes(perfil.rol)) {
    redirect("/");
  }
  return perfil;
}
