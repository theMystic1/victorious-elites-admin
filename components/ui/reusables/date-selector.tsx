"use client";

import * as React from "react";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;

  label?: string;
  placeholder?: string;

  minDate?: Date;
  maxDate?: Date;

  disabled?: boolean;
  className?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmtInput(d: Date) {
  // yyyy-mm-dd
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function clampToDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function inRange(d: Date, min?: Date, max?: Date) {
  const x = clampToDay(d).getTime();
  if (min && x < clampToDay(min).getTime()) return false;
  if (max && x > clampToDay(max).getTime()) return false;
  return true;
}

export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  className = "",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const [view, setView] = React.useState<Date>(() =>
    value ? startOfMonth(value) : startOfMonth(new Date()),
  );

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  // keep calendar month aligned with selected value
  React.useEffect(() => {
    if (value) setView(startOfMonth(value));
  }, [value]);

  // close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // close on ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const monthStart = startOfMonth(view);
  const monthEnd = endOfMonth(view);
  const firstWeekday = monthStart.getDay(); // 0=Sun

  // Build a 6-week grid (42 cells)
  const days: (Date | null)[] = React.useMemo(() => {
    const out: (Date | null)[] = [];
    // leading blanks
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    // month days
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      out.push(new Date(view.getFullYear(), view.getMonth(), d));
    }
    // trailing blanks to fill 42
    while (out.length < 42) out.push(null);
    return out;
  }, [firstWeekday, monthEnd, view]);

  const monthLabel = view.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const setDate = (d: Date) => {
    if (!inRange(d, minDate, maxDate)) return;
    onChange(d);
    setOpen(false);
  };

  const onManualInput = (v: string) => {
    if (!v) {
      onChange(null);
      return;
    }
    // v is yyyy-mm-dd
    const [yy, mm, dd] = v.split("-").map(Number);
    if (!yy || !mm || !dd) return;
    const d = new Date(yy, mm - 1, dd);
    if (Number.isNaN(d.getTime())) return;
    if (!inRange(d, minDate, maxDate)) return;
    onChange(d);
    setView(startOfMonth(d));
  };

  if (!mounted) return null;

  return (
    <div ref={rootRef} className={["relative w-full", className].join(" ")}>
      {label ? (
        <label className="mb-1 block text-sm font-black text-black/80">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          ref={inputRef}
          type="date"
          value={value ? fmtInput(value) : ""}
          onChange={(e) => onManualInput(e.target.value)}
          onFocus={() => !disabled && setOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          min={minDate ? fmtInput(minDate) : undefined}
          max={maxDate ? fmtInput(maxDate) : undefined}
          className={[
            "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-gray-200",
            disabled ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        />

        {/* optional: click target */}
        <button
          type="button"
          onClick={() => !disabled && setOpen((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          📅
        </button>
      </div>

      {open ? (
        <div className="absolute z-99999999 mt-2 w-[320px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView((d) => addMonths(d, -1))}
              className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
              aria-label="Previous month"
            >
              ←
            </button>

            <div className="text-sm font-semibold text-gray-900">
              {monthLabel}
            </div>

            <button
              type="button"
              onClick={() => setView((d) => addMonths(d, 1))}
              className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          {/* Weekdays */}
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <div key={i} className="h-9" />;

              const isSelected = value ? sameDay(d, value) : false;
              const isToday = sameDay(d, new Date());
              const disabledDay = !inRange(d, minDate, maxDate);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => setDate(d)}
                  className={[
                    "h-9 rounded-lg text-sm",
                    disabledDay
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-50 text-gray-900",
                    isSelected
                      ? "bg-gray-900 text-white hover:bg-gray-900"
                      : "",
                    !isSelected && isToday ? "ring-1 ring-gray-300" : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const today = clampToDay(new Date());
                if (!inRange(today, minDate, maxDate)) return;
                onChange(today);
                setView(startOfMonth(today));
                setOpen(false);
              }}
              className="rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
