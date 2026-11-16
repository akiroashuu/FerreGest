"use client";

import { useActionState } from "react";
import { Aviso } from "@/components/ui/aviso";
import { Boton } from "@/components/ui/boton";
import { Campo } from "@/components/ui/campo";
import { iniciarSesion, type EstadoLogin } from "@/modules/auth/actions";
import { validarLogin } from "@/modules/auth/schema";

const ESTADO_INICIAL: EstadoLogin = {};

/**
 * Valida primero en el navegador (respuesta inmediata, sin viaje al servidor)
 * y solo si todo está bien llama a la Server Action, que valida otra vez.
 */
async function enviar(
  estadoPrevio: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const correo = String(formData.get("correo") ?? "");
  const validacion = validarLogin({
    correo,
    contrasena: String(formData.get("contrasena") ?? ""),
  });
  if (!validacion.ok) {
    return { errores: validacion.errores, correo };
  }
  return iniciarSesion(estadoPrevio, formData);
}

export function FormularioLogin() {
  const [estado, accion, enviando] = useActionState(enviar, ESTADO_INICIAL);

  return (
    <form action={accion} noValidate className="flex flex-col gap-5">
      {estado.mensaje ? <Aviso tipo="error">{estado.mensaje}</Aviso> : null}

      <Campo
        id="correo"
        name="correo"
        type="email"
        etiqueta="Correo"
        autoComplete="username"
        inputMode="email"
        defaultValue={estado.correo ?? ""}
        error={estado.errores?.correo}
        required
      />
      <Campo
        id="contrasena"
        name="contrasena"
        type="password"
        etiqueta="Contraseña"
        autoComplete="current-password"
        error={estado.errores?.contrasena}
        required
      />

      <Boton type="submit" anchoCompleto disabled={enviando} className="h-12">
        {enviando ? "Ingresando…" : "Ingresar"}
      </Boton>
    </form>
  );
}
