const StatCard = ({ label, value, accent = 'rose' }) => {
  const accents = {
    rose: 'from-rose-500 to-red-600',
    amber: 'from-amber-400 to-orange-500',
    emerald: 'from-emerald-400 to-emerald-600',
  };

  return (
    <div className="medical-card overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${accents[accent] || accents.rose}`} />
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

