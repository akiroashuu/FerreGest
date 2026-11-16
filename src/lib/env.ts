/**
 * Variables de entorno públicas de Supabase.
 *
 * La clave publicable puede llegar al navegador: lo que protege los datos es
 * Row Level Security en la base. La clave de servicio NUNCA va aquí.
 */
function requerida(nombre: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno ${nombre}. Copia .env.example a .env.local y complétala.`,
    );
  }
  return valor;
}

export function obtenerEnvSupabase() {
  return {
    url: requerida(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    clavePublica: requerida(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}
