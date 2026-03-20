"use client";

import * as React from "react";

type Id = string | number;

export type SelectOption = {
  value: Id;
  label: string;
  disabled?: boolean;
};

type Props = {
  options: SelectOption[];
  value: Id | "";
  onChange: (value: string) => void;

  placeholder?: string; // shown as first option
  searchPlaceholder?: string; // input placeholder
  emptyText?: string;

  disabled?: boolean;
  className?: string;

  // optional: custom filter
  filterFn?: (opt: SelectOption, q: string) => boolean;
};

export default function SearchableNativeSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  disabled = false,
  className = "",
  filterFn,
}: Props) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return options;

    const fn =
      filterFn ??
      ((opt: SelectOption, qq: string) => opt.label.toLowerCase().includes(qq));

    return options.filter((opt) => fn(opt, query));
  }, [options, q, filterFn]);

  console.log(placeholder);

  return (
    <div className={["space-y-2", className].join(" ")}>
      <select
        value={String(value) || placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg  bg-white input text-sm text-black focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <option value="">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            disabled={disabled}
            className="w-full rounded-lg border border-white/10 bg-white input text-sm text-black placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </option>
        <option value={placeholder} disabled>
          {placeholder}
        </option>
        {filtered.length === 0 ? (
          <option value="" disabled>
            {emptyText}
          </option>
        ) : (
          filtered.map((opt) => (
            <option
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
