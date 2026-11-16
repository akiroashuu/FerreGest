import type { Metadata } from "next";
import { FormularioLogin } from "./formulario-login";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function PaginaLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-borde bg-superficie p-8">
        <p className="text-xl font-bold">FerreGest</p>
        <h1 className="mt-6 text-2xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 mb-6 text-tenue">
          Ingresa con el correo y la contraseña que te dio el administrador.
        </p>
        <FormularioLogin />
      </div>
    </main>
  );
}
