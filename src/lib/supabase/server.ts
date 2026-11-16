import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { obtenerEnvSupabase } from "@/lib/env";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Usa la sesión del usuario guardada en cookies, por lo que todas las
 * consultas pasan por Row Level Security.
 */
export async function crearClienteServidor() {
  const almacen = await cookies();
  const { url, clavePublica } = obtenerEnvSupabase();

  return createServerClient(url, clavePublica, {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(cookiesNuevas) {
        try {
          for (const { name, value, options } of cookiesNuevas) {
            almacen.set(name, value, options);
          }
        } catch {
          // Un Server Component no puede escribir cookies. No es un problema:
          // src/proxy.ts renueva la sesión en cada petición.
        }
      },
    },
  });
}
