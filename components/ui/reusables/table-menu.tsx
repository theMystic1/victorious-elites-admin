"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { FaEllipsisVertical } from "react-icons/fa6";

export type RowAction = {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "default" | "danger";
  disabled?: boolean;
};

type Props = {
  actions: RowAction[];
  align?: "left" | "right";
};

export default function RowActionsMenuPortal({
  actions,
  align = "right",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(
    null,
  );

  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  const updatePosition = React.useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();
    const top = r.bottom + 8; // 8px gap

    // width assumption (menu width) — can be refined
    const menuWidth = 200;

    let left = align === "right" ? r.right - menuWidth : r.left;

    // keep inside viewport
    const pad = 8;
    left = Math.max(pad, Math.min(left, window.innerWidth - menuWidth - pad));

    setPos({ top, left });
  }, [align]);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const runAction = async (a: RowAction) => {
    if (a.disabled) return;
    setOpen(false);
    await a.onClick();
  };

  const menu =
    open && mounted && pos
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: 200,
            }}
            className={`z-[2147483647] overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl `}
          >
            <div className="py-1">
              {actions.map((a, idx) => (
                <button
                  key={`${a.label}-${idx}`}
                  type="button"
                  role="menuitem"
                  disabled={a.disabled}
                  onClick={() => void runAction(a)}
                  className={[
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm cursor-pointer",
                    " hover:bg-black/5 focus:outline-none focus:bg-white/5",
                    a.disabled ? "opacity-50 cursor-not-allowed " : "",
                    a.variant === "danger" ? "text-red-400" : "text-black/90",
                  ].join(" ")}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-900 bg-white/80 hover:text-neutral-800 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 cursor-pointer"
      >
        <span className="text-lg leading-none">
          <FaEllipsisVertical size={16} />
        </span>
      </button>

      {menu}
    </>
  );
}
