const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[240px] flex-col items-center justify-center gap-4">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-100 border-t-medical-600" />
    <p className="text-sm font-medium text-slate-500">{label}</p>
  </div>
);

export default LoadingSpinner;

