import { MenuLateral } from "@/components/layout/menu-lateral";
import { Boton } from "@/components/ui/boton";
import { obtenerPerfil } from "@/lib/auth";
import { cerrarSesion } from "@/modules/auth/actions";
import { NOMBRE_ROL } from "@/modules/auth/roles";

// Todo el panel depende de la sesión del usuario, así que no puede
// prerenderizarse: se permite que estas rutas esperen al servidor.
export const instant = false;

/**
 * Layout de todas las pantallas del sistema: menú lateral + contenido.
 * obtenerPerfil() redirige a /login si no hay sesión válida.
 */
export default async function LayoutPanel({ children }: LayoutProps<"/">) {
  const perfil = await obtenerPerfil();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-superficie focus:px-4 focus:py-2"
      >
        Saltar al contenido
      </a>

      <nav
        aria-label="Menú principal"
        className="flex shrink-0 flex-col gap-4 border-b border-borde bg-superficie px-4 py-6 md:w-56 md:border-r md:border-b-0"
      >
        <p className="px-3 text-xl font-bold">FerreGest</p>
        <MenuLateral />

        <div className="mt-auto flex flex-col gap-3 border-t border-borde px-3 pt-4">
          <div>
            <p className="font-semibold">{perfil.nombre}</p>
            <p className="text-sm text-tenue">{NOMBRE_ROL[perfil.rol]}</p>
          </div>
          <form action={cerrarSesion}>
            <Boton type="submit" variante="secundario" anchoCompleto>
              Cerrar sesión
            </Boton>
          </form>
        </div>
      </nav>

      <main id="contenido" className="min-w-0 flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
