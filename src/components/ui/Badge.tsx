export function Badge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: "zinc" | "emerald" | "amber" | "red";
}) {
  const style =
    tone === "emerald"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      : tone === "amber"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/20"
      : tone === "red"
      ? "bg-rose-500/15 text-rose-300 border-rose-500/20"
      : "bg-zinc-700/40 text-zinc-300 border-zinc-600/40";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] ${style}`}
    >
      {children}
    </span>
  );
}
