"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AndesProductCard } from "@/components/AndesProductCard";
import type { AndesProduct } from "@/data/productos";
import styles from "@/components/AndesInternal.module.css";

type AndesCatalogProps = {
  products: AndesProduct[];
  categories: string[];
  initialCategory?: string;
};

const PAGE_SIZE = 6;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value: string) {
  return normalize(value)
    .replace(/&/g, "y")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getCategoryFromSlug(categories: string[], categorySlug?: string) {
  if (!categorySlug || categorySlug === "todos") return "Todos";

  const matchedCategory = categories.find(
    (category) => slugify(category) === categorySlug
  );

  return matchedCategory ?? "Todos";
}

export function AndesCatalog({
  products,
  categories,
  initialCategory = "todos",
}: AndesCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() =>
    getCategoryFromSlug(categories, initialCategory)
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("destacados");
  const [page, setPage] = useState(1);
  const [bioFilter, setBioFilter] = useState<"todos" | "bio">("todos");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategory(getCategoryFromSlug(categories, initialCategory));
    setPage(1);
  }, [categories, initialCategory]);

  const conditions = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.condicionVenta))
      ).sort(),
    [products]
  );

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setIsCategoryOpen(false);
    setPage(1);
  }

  function toggleCondition(value: string) {
    setSelectedConditions((current) =>
      current.includes(value)
        ? current.filter((condition) => condition !== value)
        : [...current, value]
    );
    setPage(1);
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);

    const matches = products.filter((product) => {
      const matchesCategory =
        category === "Todos" || product.categoria === category;

      const matchesCondition =
        !selectedConditions.length ||
        selectedConditions.includes(product.condicionVenta);

      const matchesBioequivalent =
        bioFilter === "todos" || product.bioequivalente === true;

      const searchable = normalize(
        [
          product.nombre,
          product.categoria,
          product.principioActivo,
          product.formato,
          product.condicionVenta,
          product.laboratorio,
          product.descripcion,
          product.bioequivalente ? "bioequivalente" : ""
        ].join(" ")
      );

      return (
        matchesCategory &&
        matchesCondition &&
        matchesBioequivalent &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      }

      if (sortBy === "precio-menor") {
        return (
          (a.precio ?? Number.MAX_SAFE_INTEGER) -
          (b.precio ?? Number.MAX_SAFE_INTEGER)
        );
      }

      if (sortBy === "precio-mayor") {
        return (b.precio ?? 0) - (a.precio ?? 0);
      }

      return products.indexOf(a) - products.indexOf(b);
    });
  }, [category, products, query, selectedConditions, sortBy, bioFilter]);
  

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  function getPaginationItems(current: number, total: number) {
    const delta = 2;
    const range: Array<number | string> = [];

    if (total <= 1) return [1];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);

    if (left > 2) {
      range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < total - 1) {
      range.push("...");
    }

    if (total > 1) {
      range.push(total);
    }

    return range;
  }

  useEffect(() => {
    // Reset to first page when search, category, conditions, sort or bio filter change
    setPage(1);
  }, [query, category, selectedConditions, sortBy, bioFilter]);

  useEffect(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    // Ensure current page is within bounds when totalPages changes
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={styles.catalogLayout}>
      <section className={styles.productArea} aria-label="Listado de productos">
        <div className={styles.catalogFilters} aria-label="Filtros de productos">
          <div
            ref={categoryDropdownRef}
            className={styles.filterSelectWrap}
            onPointerLeave={() => setIsCategoryOpen(false)}
          >
            <span id="category-filter-label">Categorías</span>
            <div className={styles.categoryDropdown}>
              <button
                type="button"
                className={styles.categorySelect}
                aria-haspopup="listbox"
                aria-expanded={isCategoryOpen}
                aria-labelledby="category-filter-label category-filter-value"
                onClick={() => setIsCategoryOpen((isOpen) => !isOpen)}
              >
                <span id="category-filter-value">{category}</span>
                <span className={styles.categoryChevron} aria-hidden="true" />
              </button>

              {isCategoryOpen ? (
                <div
                  className={styles.categoryMenu}
                  role="listbox"
                  aria-labelledby="category-filter-label"
                >
                  {["Todos", ...categories].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        item === category
                          ? styles.categoryOptionActive
                          : styles.categoryOption
                      }
                      role="option"
                      aria-selected={item === category}
                      onClick={() => updateCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <label className={styles.bioSelectWrap}>
            <span className="sr-only">Bioequivalentes</span>
            <select
              className={styles.bioSelect}
              value={bioFilter}
              aria-label="Filtrar bioequivalentes"
              onChange={(event) => {
                setBioFilter(event.target.value as "todos" | "bio");
                setPage(1);
              }}
            >
              <option value="todos">Bioequivalente</option>
              <option value="bio">Solo bioequivalentes</option>
            </select>
          </label>

          <div className={styles.conditionFilters} aria-label="Condicion de venta">
            {conditions.map((condition) => (
              <label key={condition} className={styles.conditionChip}>
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => toggleCondition(condition)}
                />
                <span>{condition}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={styles.catalogTools}>
          <div className={styles.fiboSearch}>
            <label className="sr-only" htmlFor="product-fibo-search">
              Buscar producto
            </label>

            <input
              id="product-fibo-search"
              type="search"
              value={query}
              placeholder="Buscar producto..."
              autoComplete="off"
              onChange={(event) => updateQuery(event.target.value)}
            />

            <button type="button" aria-label="Buscar productos">
              Buscar
            </button>
            
          </div>

          <select
            className={styles.sortSelect}
            value={sortBy}
            aria-label="Ordenar productos"
            onChange={(event) => {
              setSortBy(event.target.value);
              setPage(1);
            }}
          >
            <option value="destacados">Ordenar: Destacados</option>
            <option value="nombre">Ordenar: Nombre</option>
            <option value="precio-menor">Precio menor</option>
            <option value="precio-mayor">Precio mayor</option>
          </select>
        </div>

        {visibleProducts.length ? (
          <>
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <AndesProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav className={styles.pagination} aria-label="Paginación de productos">
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Anterior"
                >
                  &lt;
                </button>

                {getPaginationItems(currentPage, totalPages).map((item, idx) => {
                  if (item === "...") {
                    return (
                      <span key={`e-${idx}`} className={styles.paginationEllipsis} aria-hidden>
                        ...
                      </span>
                    );
                  }

                  const pageNum = item as number;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={
                        currentPage === pageNum ? styles.pageButtonActive : styles.pageButton
                      }
                      onClick={() => setPage(pageNum)}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  aria-label="Siguiente"
                >
                  &gt;
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className={styles.empty}>
            No encontramos productos para esta búsqueda. Escríbenos por
            WhatsApp.
          </div>
        )}
      </section>
    </div>
  );
}
