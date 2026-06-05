from __future__ import annotations

import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}


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


def sheet_paths(zf: zipfile.ZipFile) -> list[tuple[str, str]]:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"].lstrip("/")
        for rel in rels.findall("r:Relationship", REL_NS)
    }

    sheets: list[tuple[str, str]] = []
    for sheet in workbook.findall("a:sheets/a:sheet", NS):
        name = sheet.attrib.get("name", "Sheet")
        rel_id = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target = rel_map.get(rel_id or "")
        if not target:
            continue
        path = target if target.startswith("xl/") else f"xl/{target}"
        sheets.append((name, path))
    return sheets


def read_rows(zf: zipfile.ZipFile, path: str, strings: list[str]) -> list[list[str]]:
    root = ET.fromstring(zf.read(path))
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


def main() -> int:
    path = Path(sys.argv[1])
    with zipfile.ZipFile(path) as zf:
        strings = shared_strings(zf)
        for sheet_name, sheet_path in sheet_paths(zf):
            rows = read_rows(zf, sheet_path, strings)
            print(f"SHEET: {sheet_name} ({len(rows)} non-empty rows)")
            for row in rows[:8]:
                print("  " + " | ".join(row[:12]))
            print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
