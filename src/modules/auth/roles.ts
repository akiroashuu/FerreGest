/** Roles del sistema. Deben coincidir con el tipo `rol_usuario` de la base. */
export const ROLES = ["administrador", "bodeguero", "vendedor"] as const;

export type Rol = (typeof ROLES)[number];

export const NOMBRE_ROL: Record<Rol, string> = {
  administrador: "Administrador",
  bodeguero: "Bodeguero",
  vendedor: "Vendedor",
};

export function esRol(valor: unknown): valor is Rol {
  return typeof valor === "string" && ROLES.includes(valor as Rol);
}
