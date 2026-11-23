"use client";

import {
  useState,
  type ChangeEvent,
} from "react";

import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

export default function SearchBox({
  onSearch,
}: SearchBoxProps) {
  const [value, setValue] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const nextValue = event.target.value;

    setValue(nextValue);
    onSearch(nextValue);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      aria-label="Search notes"
      value={value}
      onChange={handleChange}
    />
  );
}