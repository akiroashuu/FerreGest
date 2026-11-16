import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { obtenerEnvSupabase } from "@/lib/env";

const RUTA_LOGIN = "/login";

/**
 * Se ejecuta antes de cada petición:
 * 1. Renueva la sesión de Supabase (refresca el token en las cookies).
 * 2. Envía a /login a quien no tiene sesión.
 * 3. Envía al inicio a quien ya tiene sesión e intenta abrir /login.
 *
 * Es la primera barrera, no la única: cada página y cada acción vuelve a
 * comprobar la sesión, y la base de datos aplica Row Level Security.
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const { url, clavePublica } = obtenerEnvSupabase();

  const supabase = createServerClient(url, clavePublica, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesNuevas) {
        for (const { name, value } of cookiesNuevas) {
          request.cookies.set(name, value);
        }
        respuesta = NextResponse.next({ request });
        for (const { name, value, options } of cookiesNuevas) {
          respuesta.cookies.set(name, value, options);
        }
      },
    },
  });

  // getClaims() verifica la firma del token; no confía en la cookie a ciegas.
  const { data } = await supabase.auth.getClaims();
  const tieneSesion = Boolean(data?.claims);
  const enLogin = request.nextUrl.pathname === RUTA_LOGIN;

  if (!tieneSesion && !enLogin) {
    return redirigir(request, respuesta, RUTA_LOGIN);
  }
  if (tieneSesion && enLogin) {
    return redirigir(request, respuesta, "/");
  }
  return respuesta;
}

/** Redirige conservando las cookies de sesión que Supabase haya renovado. */
function redirigir(
  request: NextRequest,
  respuesta: NextResponse,
  ruta: string,
) {
  const destino = request.nextUrl.clone();
  destino.pathname = ruta;
  destino.search = "";
  const redireccion = NextResponse.redirect(destino);
  for (const cookie of respuesta.cookies.getAll()) {
    redireccion.cookies.set(cookie);
  }
  return redireccion;
}

export const config = {
  // Todo excepto archivos estáticos e imágenes.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
