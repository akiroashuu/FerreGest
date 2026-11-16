export type ElementoMenu = {
  etiqueta: string;
  ruta: string;
  /** false mientras el módulo no esté construido: se muestra sin enlace. */
  disponible: boolean;
};

/** Menú lateral. Se activa cada módulo a medida que se implementa. */
export const MENU: ElementoMenu[] = [
  { etiqueta: "Inicio", ruta: "/", disponible: true },
  { etiqueta: "Vender", ruta: "/ventas/nueva", disponible: false },
  { etiqueta: "Productos", ruta: "/productos", disponible: false },
  { etiqueta: "Inventario", ruta: "/inventario", disponible: false },
  { etiqueta: "Clientes y fiado", ruta: "/clientes", disponible: false },
  { etiqueta: "Proveedores", ruta: "/proveedores", disponible: false },
  { etiqueta: "Reportes", ruta: "/reportes", disponible: false },
];
