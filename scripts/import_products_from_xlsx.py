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
    "Veterinaria": "/products/receta.svg",
    "Accesorios": "/products/suero.svg",
    "Homeopatía": "/products/suero.svg",
}

PRESCRIPTION_TERMS = (
    "AMOX", "AZITRO", "CLARITRO", "CIPRO", "CEFA", "CEFTR", "CEFU", "LEVO",
    "DOXI", "METRONID", "CLIND", "TRAMADOL", "CLONAZ", "ALPRAZ", "DIAZEP",
    "PREGAB", "QUETIA", "SERTRAL", "FLUOX", "PAROX", "ESCITAL", "VENLAF",
    "LOSARTAN", "ENALAPRIL", "METFORM", "GLIBEN", "INSUL", "PREDN",
)

LOWERCASE_WORDS = {
    "bioequivalente",
    "bloqueador",
    "cápsula",
    "cápsulas",
    "comprimido",
    "comprimidos",
    "con",
    "crema",
    "dermatológico",
    "gramo",
    "gramos",
    "gotas",
    "jarabe",
    "mililitro",
    "mililitros",
    "oftálmica",
    "oftálmico",
    "oral",
    "para",
    "polvo",
    "recubiertos",
    "sin",
    "solar",
    "solución",
    "sublingual",
    "suspensión",
    "ungüento",
    "vaginal",
}

UPPERCASE_WORDS = {"ADN", "FPS", "NF", "SPF", "UI", "XR", "LP"}

UNIT_WORDS = {
    "G": "g",
    "GR": "g",
    "GM": "mg",
    "IU": "UI",
    "L": "l",
    "MCG": "mcg",
    "MG": "mg",
    "ML": "ml",
}

ABBREVIATION_REPLACEMENTS = (
    (r"\(VET\)", "Veterinario"),
    (r"\bB\s*E\b", "bioequivalente"),
    (r"\bCOM\s*REC\b|\bCOMREC\b|\bCOMRE\b", "comprimidos recubiertos"),
    (r"\bCOMP?\b", "comprimidos"),
    (r"\bCAPS?\b", "cápsulas"),
    (r"\bJBE\b", "jarabe"),
    (r"\bPVO\s+JARABE\b|\bPVO\s+JBE\b", "polvo para jarabe"),
    (r"\bPVO\b", "polvo"),
    (r"\bSUSP\b", "suspensión"),
    (r"\bSOL\s+OFT\b|\bSOL\s+OF\b", "solución oftálmica"),
    (r"\bSOL\b", "solución"),
    (r"\bGTS\b", "gotas"),
    (r"\bBL\b", "blíster"),
    (r"\bUNG\b", "ungüento"),
    (r"\bCR\s+VAG\b", "crema vaginal"),
    (r"\bCR\b", "crema"),
    (r"\bDER\b", "dermatológico"),
    (r"\bCOMP\s+SUBL\b|\bSUBL\b", "sublingual"),
    (r"\bBLOQ\s+SP\b|\bBLOQ\b", "bloqueador solar"),
    (r"\bFOTOPROT\b", "fotoprotector"),
    (r"\bAC\s+ACETIL\b", "Ácido acetilsalicílico"),
    (r"\bAC\b", "Ácido"),
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


def smart_case(value: str) -> str:
    words: list[str] = []

    for raw_word in value.split():
        word = raw_word.strip()
        if not word:
            continue

        prefix = ""
        suffix = ""
        while word and word[0] in "([{":
            prefix += word[0]
            word = word[1:]
        while word and word[-1] in ")]},":
            suffix = word[-1] + suffix
            word = word[:-1]

        normalized_core = normalize_key(word)
        lower_word = word.lower()

        if normalized_core in UNIT_WORDS:
            cased = UNIT_WORDS[normalized_core]
        elif normalized_core in UPPERCASE_WORDS:
            cased = normalized_core
        elif normalized_core == "X" and lower_word == "x":
            cased = "x"
        elif lower_word in LOWERCASE_WORDS:
            cased = lower_word
        elif re.fullmatch(r"\d+(?:[,.]\d+)?%?", word):
            cased = word
        elif re.search(r"\d", word) and re.search(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", word):
            cased = word.upper() if len(word) <= 4 else word.capitalize()
        else:
            cased = lower_word.capitalize()

        words.append(f"{prefix}{cased}{suffix}")

    return clean_text(" ".join(words))


def expand_units(value: str) -> str:
    text = value
    text = re.sub(r"(?<=\d)\.(?=\d)", ",", text)
    text = re.sub(r"(?<=\d)\s*(MG|MCG|ML|GR|GM|G|L|UI|IU)\b", r" \1", text, flags=re.IGNORECASE)
    text = re.sub(
        r"\b(MG|MCG|ML|GR|GM|G|L|UI|IU)\s*(?=\d)",
        lambda match: f"{UNIT_WORDS.get(match.group(1).upper(), match.group(1).lower())} ",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"\b(\d+(?:[,.]\d+)?)\s*GM\b", r"\1 MG", text, flags=re.IGNORECASE)
    return text


def normalize_medical_text(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ""

    text = text.replace("ÁCIDO", "ACIDO").replace("Ácido", "Acido")
    text = re.sub(r"\bC/", "con ", text, flags=re.IGNORECASE)
    text = re.sub(r"\bS/", "sin ", text, flags=re.IGNORECASE)
    text = expand_units(text)
    text = text.replace("+", " + ")
    text = text.replace(".", " ")
    text = re.sub(r"([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(\d)", r"\1 \2", text)
    text = re.sub(
        r"(\d)(COMREC|COMRE|COM|COMP|CAPS|CAP|SOB|AMP|UN|DS)\b",
        r"\1 \2",
        text,
        flags=re.IGNORECASE,
    )

    for pattern, replacement in ABBREVIATION_REPLACEMENTS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    text = re.sub(r"\s*/\s*", " / ", text)
    text = clean_text(text)
    text = text.replace("Acido", "Ácido").replace("ACIDO", "Ácido")
    result = smart_case(text).replace(" / ", "/")
    result = result.replace("Capsula", "Cápsula").replace("capsula", "cápsula")
    result = re.sub(r"\b1 comprimidos\b", "1 comprimido", result, flags=re.IGNORECASE)
    result = re.sub(r"\b1 cápsulas\b", "1 cápsula", result, flags=re.IGNORECASE)
    return result[:1].upper() + result[1:] if result else result


def normalized_lookup(value: str) -> str:
    text = normalize_key(value)
    return re.sub(r"(MG|MCG|ML|GR|GM|G|L|UI|IU|COM|COMP|CAPS|CAP|SOB|AMP)$", "", text)


def active_is_in_name(active: str, name: str) -> bool:
    active_words = [
        normalized_lookup(word)
        for word in re.split(r"[\s,/()+-]+", active)
        if len(normalized_lookup(word)) >= 5
    ]
    name_key = normalized_lookup(name)
    return any(word and word in name_key for word in active_words[:3])


def normalize_product_name(name: str, active: str) -> str:
    product_name = normalize_medical_text(name)
    active_name = normalize_medical_text(active)

    if active_name and not active_is_in_name(active_name, product_name):
        return f"{product_name} ({active_name})"

    return product_name


def infer_category(name: str, department: str = "") -> str:
    upper = name.upper()
    department_key = normalize_key(department)

    if any(term in upper for term in ("FPS", "SOLAR", "BLOQ", "SUN", "FOTOPROT")):
        return "Protección solar"
    if department_key == "VETERINARIA":
        return "Veterinaria"
    if department_key == "ACCESORIOS":
        return "Accesorios"
    if department_key == "HOMEOPATIAHMEDICINALES":
        return "Homeopatía"
    if department_key in {"ALIMENTOS", "AGUASYBEBIDAS"}:
        return "Cuidado familiar"
    if any(term in upper for term in ("ALCOHOL", "JABON", "JABÓN", "TOALLA", "PAÑAL", "DESOD", "PASTA DENT", "CEPILLO", "ENJUAG")):
        return "Higiene"
    if department_key in {"PERFUMERIA", "ASEOPERSONAL"}:
        return "Dermocosmética"
    if any(term in upper for term in ("CREMA", "DERM", "LOCION", "LOCIÓN", "SHAMPOO", "ACOND", "SERUM", "BALSAMO", "UNG", "POMADA")):
        return "Dermocosmética"
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
            return normalize_medical_text(match.group(0).replace(".", " "))
    return "Formato a consultar"


def presentation_label(units: str, presentation: str, fallback_name: str) -> str:
    unit_value = clean_text(units)
    presentation_value = normalize_medical_text(presentation)

    if unit_value:
        try:
            number = float(unit_value.replace(",", "."))
            unit_value = str(int(number)) if number.is_integer() else str(number).replace(".", ",")
        except ValueError:
            pass

    if unit_value and presentation_value:
        singular = unit_value in {"1", "1,0"}
        label = presentation_value.lower()
        if not singular and label == "comprimido":
            label = "comprimidos"
        elif singular and label == "capsula":
            label = "cápsula"
        elif not singular and label in {"cápsula", "capsula"}:
            label = "cápsulas"
        return smart_case(f"{unit_value} {label}")

    return infer_format(fallback_name)


def requires_prescription(name: str) -> bool:
    upper = name.upper()
    return any(term in upper for term in PRESCRIPTION_TERMS)


def parse_price(value: str) -> int:
    cleaned = re.sub(r"[^0-9,.-]+", "", value).strip()
    if not cleaned:
        return 0

    if "," in cleaned and "." in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")
    elif "," in cleaned:
        cleaned = cleaned.replace(",", ".")

    try:
        return int(round(float(cleaned)))
    except ValueError:
        return 0


def product_description(therapeutic_action: str, presentation: str, requires_recipe: bool) -> str:
    parts: list[str] = []
    action = normalize_medical_text(therapeutic_action)

    if action:
        parts.append(f"{action}.")
    if presentation:
        parts.append(f"Presentación: {presentation}.")
    parts.append("Venta con receta médica." if requires_recipe else "Venta directa o según indicación profesional.")
    parts.append("Precio referencial del listado vigente; confirma disponibilidad por WhatsApp.")

    return " ".join(parts)


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
        raw_name = cell(row, "PRODUCTO", "DESCRIPCIÓN", "DESCRIPCION")
        active = cell(row, "PRINCIPIO ACTIVO")
        brand = cell(row, "LABORATORIO", "LÍNEA", "LINEA") or "Farmacia Andes"
        department = cell(row, "DEPARTAMENTO")
        therapeutic_action = cell(row, "ACCIÓN TERAPÉUTICA", "ACCION TERAPEUTICA")
        presentation = presentation_label(
            cell(row, "UNIDADES PRESENTACIÓN", "UNIDADES PRESENTACION"),
            cell(row, "PRESENTACIÓN", "PRESENTACION"),
            raw_name,
        )
        recipe = cell(row, "RECETA MÉDICA", "RECETA MEDICA")
        control_legal = cell(row, "CONTROL LEGAL")

        if not raw_name:
            continue

        name = normalize_product_name(raw_name, active)
        requires_recipe = "RECETA" in normalize_key(recipe) or bool(control_legal)
        category = infer_category(raw_name, department)

        base_id = f"prod-{raw_id}" if raw_id else slugify(name)
        base_id = base_id.replace(".0", "")
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
                "descripcionCorta": product_description(therapeutic_action, presentation, requires_recipe),
                "precio": parse_price(cell(row, "PRECIO")),
                "requiereReceta": requires_recipe or requires_prescription(name),
                "destacado": len(products) < 6,
                "imagenUrl": IMAGE_BY_CATEGORY.get(category, "/products/receta.svg"),
                "formato": presentation,
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
    priced = sum(1 for product in products if int(product["precio"]) > 0)
    print(f"Products with prices: {priced}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
