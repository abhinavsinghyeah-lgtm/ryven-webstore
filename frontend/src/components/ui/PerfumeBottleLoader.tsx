type PerfumeBottleLoaderProps = {
  label?: string;
  fullscreen?: boolean;
};

export function PerfumeBottleLoader({
  label = "Loading experience...",
  fullscreen = false,
}: PerfumeBottleLoaderProps) {
  return (
    <div className={fullscreen ? "flex min-h-[60vh] flex-col items-center justify-center gap-5" : "flex flex-col items-center justify-center gap-4 py-10"}>
      <div className="perfume-loader" aria-hidden="true">
        <div className="perfume-loader__cap" />
        <div className="perfume-loader__neck" />
        <div className="perfume-loader__body">
          <div className="perfume-loader__shine" />
          <div className="perfume-loader__liquid" />
          <div className="perfume-loader__spray perfume-loader__spray--one" />
          <div className="perfume-loader__spray perfume-loader__spray--two" />
          <div className="perfume-loader__spray perfume-loader__spray--three" />
        </div>
      </div>
      <p className="text-sm font-medium tracking-[0.08em] text-neutral-600">{label}</p>
    </div>
  );
}
