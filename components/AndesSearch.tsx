"use client";

import styles from "@/components/AndesInternal.module.css";

type AndesSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
};

export function AndesSearch({ value, onChange, placeholder, label }: AndesSearchProps) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <input
        className={styles.search}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
