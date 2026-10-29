interface ITaskStatsProps {
  total: number;
  completed: number;
  active: number;
}

const stats = [
  { label: "Усього завдань", valueKey: "total", color: "text-slate-900" },
  { label: "Виконано", valueKey: "completed", color: "text-emerald-700" },
  { label: "Залишилось", valueKey: "active", color: "text-indigo-700" },
] as const;

export const TaskStats = ({ total, completed, active }: ITaskStatsProps) => {
  const values = { total, completed, active };

  return (
    <section
      aria-label="Статистика завдань"
      className="grid grid-cols-3 gap-3"
    >
      {stats.map(({ label, valueKey, color }) => (
        <div
          className="rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm sm:px-5"
          key={valueKey}
        >
          <p className={`text-2xl font-bold sm:text-3xl ${color}`}>
            {values[valueKey]}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            {label}
          </p>
        </div>
      ))}
    </section>
  );
};
