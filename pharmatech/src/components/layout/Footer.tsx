export function Footer() {
  return (
    <footer className="text-center py-10">
      <p className="flex items-center justify-center gap-2 text-slate-400 text-sm">
        Powered by
        <span className="font-bold gradient-text">Unsiyyat AI</span>
        &amp; PharmaTech
      </p>
      <p className="text-xs text-slate-300 mt-2">
        &copy; {new Date().getFullYear()} PharmaTech. Bütün hüquqlar qorunur.
      </p>
    </footer>
  );
}
