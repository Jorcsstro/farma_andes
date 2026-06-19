# Auditoría técnica Farma Andes

## Resumen general

Auditoría realizada sobre la rama `chore/debug-cleanup-project` para el proyecto Next.js `Jorcsstro/farma_andes`.

El proyecto usa App Router y las rutas productivas detectadas son:

| Ruta | Estado | Evidencia |
| --- | --- | --- |
| `/` | Activa | `app/page.tsx` renderiza `AndesHome` con `getProducts()` |
| `/productos` | Activa | `app/productos/page.tsx` renderiza `AndesCatalog` |
| `/productos/[slug]` | Activa | `generateStaticParams()` usa `getCatalogProducts()` |
| `/vademecum` | Activa | `app/vademecum/page.tsx` usa `getVademecumEntries()` |
| `/vademecum/[slug]` | Activa | `generateStaticParams()` usa fichas manuales y generadas |
| `/uso-racional-de-medicamentos` | Activa | Usa `/images/usoracional.png` y enlace MINSAL |
| `/nosotros` | No existe como ruta dedicada | No hay carpeta `app/nosotros` |
| `/contacto` | No existe como ruta dedicada | El contacto vive como ancla `/#contacto` en el footer |

Componentes principales en uso:

| Area | Archivos |
| --- | --- |
| Layout global | `app/layout.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/Footer.module.css` |
| Home | `components/AndesHome.tsx` |
| Catalogo | `components/AndesCatalog.tsx`, `components/AndesProductCard.tsx` |
| Detalle de producto | `components/AndesProductDetail.tsx`, `app/productos/[slug]/page.tsx` |
| Vademecum | `components/AndesVademecumSection.tsx`, `app/vademecum/page.tsx`, `app/vademecum/[slug]/page.tsx` |
| UI compartida | `components/AndesSearch.tsx`, `components/AndesWhatsappButton.tsx`, `components/AndesInternal.module.css` |

Fuentes de datos detectadas:

| Fuente | Rol |
| --- | --- |
| `lib/products.ts` | Fuente principal de productos; usa Supabase si existen env vars y cae a fallback local |
| `data/products.ts` | Catalogo fallback local, grande y actualmente necesario para build sin Supabase |
| `lib/catalog-products.ts` | Adaptador desde `Product` al modelo `AndesProduct` usado por catalogo/detalle |
| `data/productos.ts` | Modelo legacy `AndesProduct` y helper de relacionados; todavia se importa desde componentes activos |
| `data/vademecum.ts` | Fichas manuales del vademecum |
| `lib/vademecum.ts` | Combina fichas manuales con fichas generadas desde productos de categoria Medicamentos |
| `data/medicine-image-overrides.json` | Mapa de imagenes locales para productos importados |
| `lib/product-image-overrides.ts` | Prioriza imagenes por id/nombre y aplica fallback seguro |

## Errores encontrados

| Hallazgo | Archivo | Causa | Estado |
| --- | --- | --- | --- |
| `npm` falla en PowerShell por execution policy | Entorno local | `npm.ps1` esta bloqueado | Se uso `npm.cmd`, sin cambiar configuracion del sistema |
| Artefactos generados versionados | `.next-dev-*.log`, `tsconfig.tsbuildinfo` | Salidas locales de dev/build estaban en Git | Eliminados y agregados a `.gitignore` |
| Componentes legacy sin importadores | `components/Catalogo.tsx`, `components/ProductCard.tsx`, otros | Refactor a componentes `Andes*` dejo archivos antiguos vivos | Eliminados tras busqueda global |
| Helper Supabase sin uso | `lib/supabase.ts` | La carga real se hace dentro de `lib/products.ts` | Eliminado |
| Re-export sin uso | `slugifyProduct` en `lib/catalog-products.ts` | No habia referencias globales | Eliminado |

No se encontraron errores de ESLint, TypeScript ni build en la linea base.

## Correcciones aplicadas

| Cambio | Motivo | Evidencia |
| --- | --- | --- |
| Se agrego `*.tsbuildinfo` a `.gitignore` | Evitar versionar cache incremental de TypeScript | `tsconfig.tsbuildinfo` estaba trackeado |
| Se agrego `.next-dev-*.log` a `.gitignore` | Evitar versionar logs locales del dev server | Habia seis logs `.next-dev-*` en raiz |
| Se eliminaron componentes legacy sin uso | Reducir codigo muerto despues del refactor visual | `rg` solo encontro definiciones propias, no imports activos |
| Se elimino `lib/supabase.ts` | Helper reemplazado por `createClient` dinamico en `lib/products.ts` | Busqueda global sin importadores |
| Se elimino `slugifyProduct` | Export no referenciado | Busqueda global sin usos |
| `package-lock.json` fue actualizado por `npm install` | Sincronizacion de lockfile | Cambio menor en metadata de `postcss` |

## Archivos eliminados

| Archivo | Motivo | Evidencia | Accion |
| --- | --- | --- | --- |
| `.next-dev-3000.err.log` | Log local generado | Archivo raiz `.next-dev-*` | Eliminado |
| `.next-dev-3000.live.log` | Log local generado | Archivo raiz `.next-dev-*` | Eliminado |
| `.next-dev-3000.out.log` | Log local generado | Archivo raiz `.next-dev-*` | Eliminado |
| `.next-dev-3002.err.log` | Log local generado | Archivo raiz `.next-dev-*` | Eliminado |
| `.next-dev-3002.live.log` | Log local generado | Archivo raiz `.next-dev-*` | Eliminado |
| `.next-dev-3002.out.log` | Log local generado | Archivo raiz `.next-dev-*` | Eliminado |
| `tsconfig.tsbuildinfo` | Cache incremental generada | TypeScript lo regenera | Eliminado |
| `components/Catalogo.tsx` | Componente legacy sin importadores | `rg "Catalogo"` no mostro imports activos | Eliminado |
| `components/ClientEffects.tsx` | Componente sin importadores | Solo definicion propia | Eliminado |
| `components/FloatingWhatsApp.tsx` | Componente sin importadores | WhatsApp activo esta en Header/Footer/Andes buttons | Eliminado |
| `components/Logo.tsx` | Componente sin importadores | Header/Footer usan `next/image` directo | Eliminado |
| `components/ProductCard.tsx` | Componente legacy sin importadores | Reemplazado por `AndesProductCard` | Eliminado |
| `components/ProductCarousels.tsx` | Componente legacy sin importadores | Home activa usa `AndesHome` | Eliminado |
| `components/Sections.tsx` | Componente legacy sin importadores | Layout activo no lo usa | Eliminado |
| `components/SexualHealthPromo.tsx` | Componente sin importadores | No hay imports activos | Eliminado |
| `lib/supabase.ts` | Helper sin uso | `lib/products.ts` crea cliente Supabase dinamicamente | Eliminado |

## Archivos revisados pero conservados

| Archivo / carpeta | Motivo de conservacion |
| --- | --- |
| `data/products.ts` | Es el fallback real de `getProducts()` cuando no hay Supabase |
| `data/productos.ts` | Aunque es legacy, aun entrega el tipo `AndesProduct` y relacionados para detalle |
| `data/vademecum.ts` | Fuente manual necesaria para fichas editoriales del vademecum |
| `data/medicine-image-overrides.json` | Usado por `lib/product-image-overrides.ts` para imagenes locales |
| `public/identidad-visual/*` | Material de marca; no se elimina aunque algunas variantes no tengan referencia literal |
| `public/brands/brand-logos.json` | Generado por script de logos; sin uso runtime directo, pero util como manifest |
| `public/brands/brand-logos-preview.png` | Preview de trabajo; sin referencia runtime, recomendado revisar manualmente |
| `exports/` | Salidas de scripts WooCommerce/imagenes; no se eliminan por posible uso operacional externo |
| `app/globals.css` | Tiene clases probablemente legacy, pero el riesgo visual de poda automatica es alto |

## Archivos recomendados para revisar manualmente

| Archivo | Motivo | Evidencia | Accion recomendada |
| --- | --- | --- | --- |
| `exports/` | Exportaciones y copias de productos ocupan mucho espacio | Carpeta versionada con CSVs y assets generados | Decidir si mover a storage externo o regenerar bajo demanda |
| `public/brands/brand-logos-preview.png` | Sin referencia exacta runtime | Busqueda exacta sin resultados | Eliminar si no se usa como material de revision |
| `public/products/after-sun.svg` | Sin referencia exacta | Auditoria de assets lo marco sin uso literal | Confirmar si es icono de categoria futura |
| `public/products/leblon.svg` | Sin referencia exacta | Auditoria de assets lo marco sin uso literal | Confirmar si es producto/brand asset necesario |
| `public/sections/farmacia-andes-banner-logo.png` | Sin referencia exacta | No aparece en app/components/data/lib/scripts salvo archivo | Revisar si fue banner antiguo |
| `public/products/showcase/medicamentos/acido-acetilsalicilico-chile-100mg-100comp.jpg` | Duplicado/no referenciado exacto | Existe otro asset similar usado | Confirmar antes de borrar por posible SKU alternativo |
| `app/globals.css` | Posible CSS legacy de componentes eliminados | Muchas clases globales no estan ligadas a CSS modules | Revisar con captura visual antes de podar |

## Riesgos detectados

| Riesgo | Impacto | Recomendacion |
| --- | --- | --- |
| `data/productos.ts` mezcla modelo legacy con tipos activos | Puede confundir futuras limpiezas | Migrar el tipo `AndesProduct` a `types/` en una tarea separada |
| `app/globals.css` es grande y global | Poda automatica puede romper estilos activos | Auditar con herramienta visual/clases usadas antes de eliminar reglas |
| Assets de productos duplicados por hash | Algunos duplicados representan SKUs distintos con la misma foto | No borrar sin revisar producto/id asociado |
| No existen rutas `/nosotros` y `/contacto` | Links directos a esas rutas darian 404 | Crear paginas dedicadas o mantener contacto como `/#contacto` explicitamente |
| `exports/` vive versionado | Puede aumentar peso del repo y duplicar `public/products` | Definir politica de artefactos generados |

Duplicados binarios detectados en `public/` incluyen pares/grupos como:

| Grupo | Nota |
| --- | --- |
| `prod-15690...` / `prod-15691...` | Misma imagen para SKUs Bevitex |
| `prod-32412...` / `prod-32413...` / `prod-34055...` | Misma imagen para variantes Enhora |
| `prod-17365...` / `prod-202...` / `showcase/medicamentos/abrilar...` | Misma imagen usada en catalogo/showcase |
| `prod-46155...` / `showcase/...acido-acetilsalicilico...` | Imagen duplicada entre producto y showcase |

## Validaciones ejecutadas

| Comando | Resultado |
| --- | --- |
| `npm.cmd install` | OK; actualizo `package-lock.json` |
| `npm.cmd run lint` | OK |
| `npm.cmd run build` | OK; Next.js genero `/`, `/productos`, `/productos/[slug]`, `/vademecum`, `/vademecum/[slug]` y `/uso-racional-de-medicamentos` |

## Notas para el PR

Resumen sugerido:

- Se audito estructura, datos, rutas principales, assets y artefactos generados.
- Se elimino codigo legacy no importado y archivos generados versionados.
- Se mantuvieron `data/products.ts`, `data/productos.ts`, assets de identidad visual y `exports/` por seguridad.
- `npm.cmd run lint` y `npm.cmd run build` terminan correctamente.
- Quedan como revision manual la politica de `exports/`, poda visual de `app/globals.css` y algunos assets sin referencia literal.
