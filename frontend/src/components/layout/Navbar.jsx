import { CalendarDays } from "lucide-react";

function Navbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-800 bg-slate-950 px-8">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
        <CalendarDays
          size={16}
          className="text-[var(--color-primary)]"
        />

        <span>{today}</span>
      </div>
    </header>
  );
}

export default Navbar;