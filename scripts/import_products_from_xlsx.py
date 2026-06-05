from __future__ import annotations

import json
import re
import sys
import unicodedata
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}

IMAGE_BY_CATEGORY = {
    "Medicamentos": "/products/receta.svg",
    "Protección solar": "/products/solar-kids.svg",
    "Dermocosmética": "/products/crema.svg",
    "Cuidado familiar": "/products/suero.svg",
    "Higiene": "/products/alcohol-gel.svg",
}

PRESCRIPTION_TERMS = (
    "AMOX", "AZITRO", "CLARITRO", "CIPRO", "CEFA", "CEFTR", "CEFU", "LEVO",
    "DOXI", "METRONID", "CLIND", "TRAMADOL", "CLONAZ", "ALPRAZ", "DIAZEP",
    "PREGAB", "QUETIA", "SERTRAL", "FLUOX", "PAROX", "ESCITAL", "VENLAF",
    "LOSARTAN", "ENALAPRIL", "METFORM", "GLIBEN", "INSUL", "PREDN",
)


def text_of(node: ET.Element | None) -> str:
    if node is None:
        return ""
    return "".join(node.itertext()).strip()


def column_index(cell_ref: str) -> int:
    letters = "".join(ch for ch in cell_ref if ch.isalpha())
    value = 0
    for ch in letters:
        value = value * 26 + ord(ch.upper()) - ord("A") + 1
    return value - 1


def shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    return [text_of(item) for item in root.findall("a:si", NS)]


def sheet_paths(zf: zipfile.ZipFile) -> list[str]:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"].lstrip("/")
        for rel in rels.findall("r:Relationship", REL_NS)
    }
    paths: list[str] = []
    for sheet in workbook.findall("a:sheets/a:sheet", NS):
        rel_id = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target = rel_map.get(rel_id or "")
        if target:
            paths.append(target if target.startswith("xl/") else f"xl/{target}")
    return paths


def read_rows(path: Path) -> list[list[str]]:
    with zipfile.ZipFile(path) as zf:
        strings = shared_strings(zf)
        sheet_path = sheet_paths(zf)[0]
        root = ET.fromstring(zf.read(sheet_path))
        rows: list[list[str]] = []
        for row in root.findall(".//a:sheetData/a:row", NS):
            values: list[str] = []
            for cell in row.findall("a:c", NS):
                index = column_index(cell.attrib.get("r", "A1"))
                while len(values) <= index:
                    values.append("")
                cell_type = cell.attrib.get("t")
                if cell_type == "s":
                    raw = text_of(cell.find("a:v", NS))
                    values[index] = strings[int(raw)] if raw else ""
                elif cell_type == "inlineStr":
                    values[index] = text_of(cell.find("a:is", NS))
                else:
                    values[index] = text_of(cell.find("a:v", NS))
            while values and values[-1] == "":
                values.pop()
            if any(values):
                rows.append(values)
        return rows


def normalize_key(value: str) -> str:
    text = unicodedata.normalize("NFKD", value)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r"[^A-Z0-9]+", "", text.upper())


def slugify(value: str) -> str:
    text = unicodedata.normalize("NFKD", value)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return text[:70] or "producto"


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    value = value.replace(" .", ".").replace(" ,", ",")
    return value


def infer_category(name: str) -> str:
    upper = name.upper()
    if any(term in upper for term in ("FPS", "SOLAR", "BLOQ", "SUN", "FOTOPROT")):
        return "Protección solar"
    if any(term in upper for term in ("CREMA", "DERM", "LOCION", "LOCIÓN", "SHAMPOO", "ACOND", "SERUM", "BALSAMO", "UNG", "POMADA")):
        return "Dermocosmética"
    if any(term in upper for term in ("ALCOHOL", "JABON", "JABÓN", "TOALLA", "PAÑAL", "DESOD", "PASTA DENT", "CEPILLO", "ENJUAG")):
        return "Higiene"
    if any(term in upper for term in ("VIT", "BIOTINA", "ZINC", "OMEGA", "MAGNES", "CALCIO", "SUPLEMENT", "SUERO", "ELECTROL")):
        return "Cuidado familiar"
    return "Medicamentos"


def infer_format(name: str) -> str:
    patterns = (
        r"\b\d+\s?(?:MG|MCG|G|GR|ML|L|UI|IU|%)\b(?:[./ -]?\d+\s?(?:COM|COMP|CAPS|CAP|TAB|SOB|ML|G|GR))?",
        r"\b\d+\s?(?:COM|COMP|CAPS|CAP|TAB|SOB|AMP|OV|SUP|SACHETS?)\b",
        r"\b(?:JBE|JARABE|SOL|GTS|GOTAS|CREMA|UNG|POMADA|CAPS|COMPRIMIDOS?)\.?\s?\d*\s?(?:ML|G|GR)?\b",
    )
    upper = name.upper()
    for pattern in patterns:
        match = re.search(pattern, upper)
        if match:
            return clean_text(match.group(0).replace(".", " "))
    return "Formato a consultar"


def stock_status(stock: int) -> str:
    if stock <= 0:
        return "agotado"
    if stock <= 3:
        return "consultar"
    return "disponible"


def requires_prescription(name: str) -> bool:
    upper = name.upper()
    return any(term in upper for term in PRESCRIPTION_TERMS)


def product_description(category: str, stock: int) -> str:
    if stock <= 0:
        return "Producto en catálogo de Farmacia Andes. Consulta alternativas y nueva disponibilidad por WhatsApp."
    return (
        f"Producto disponible en Farmacia Andes. Stock referencial: {stock} "
        "unidades. Confirma disponibilidad y orientación de compra por WhatsApp."
    )


def build_products(rows: list[list[str]]) -> list[dict[str, object]]:
    header = [normalize_key(cell) for cell in rows[0]]
    index = {key: pos for pos, key in enumerate(header)}

    def cell(row: list[str], *names: str) -> str:
        for name in names:
            pos = index.get(normalize_key(name))
            if pos is not None and pos < len(row):
                return clean_text(row[pos])
        return ""

    products: list[dict[str, object]] = []
    used_ids: set[str] = set()

    for row in rows[1:]:
        raw_id = cell(row, "ID")
        name = cell(row, "DESCRIPCIÓN", "DESCRIPCION")
        brand = cell(row, "LÍNEA", "LINEA") or "Farmacia Andes"
        stock_raw = cell(row, "STOCK")
        if not name:
            continue

        try:
            stock = int(float(stock_raw.replace(",", "."))) if stock_raw else 0
        except ValueError:
            stock = 0

        category = infer_category(name)
        base_id = f"prod-{raw_id}" if raw_id else slugify(name)
        product_id = base_id
        suffix = 2
        while product_id in used_ids:
            product_id = f"{base_id}-{suffix}"
            suffix += 1
        used_ids.add(product_id)

        products.append(
            {
                "id": product_id,
                "nombre": name,
                "categoria": category,
                "marca": brand,
                "descripcionCorta": product_description(category, stock),
                "precio": 0,
                "stockEstado": stock_status(stock),
                "requiereReceta": requires_prescription(name),
                "destacado": len(products) < 6 and stock > 0,
                "imagenUrl": IMAGE_BY_CATEGORY[category],
                "formato": infer_format(name),
            }
        )
    return products


def write_products(path: Path, products: list[dict[str, object]]) -> None:
    content = (
        'import type { Product } from "@/types/product";\n\n'
        f"export const products: Product[] = {json.dumps(products, ensure_ascii=False, indent=2)};\n\n"
        "export const featuredProducts = products.filter((product) => product.destacado);\n"
    )
    path.write_text(content, encoding="utf-8", newline="\n")


def main() -> int:
    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    rows = read_rows(source)
    products = build_products(rows)
    write_products(target, products)
    print(f"Imported {len(products)} products into {target}")
    categories = sorted({str(product["categoria"]) for product in products})
    print("Categories: " + ", ".join(categories))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
