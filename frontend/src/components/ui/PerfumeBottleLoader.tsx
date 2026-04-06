type PerfumeBottleLoaderProps = {
  label?: string;
  fullscreen?: boolean;
};

export function PerfumeBottleLoader({
  fullscreen = false,
}: PerfumeBottleLoaderProps) {
  return (
    <div className={`ryven-loader${fullscreen ? " ryven-loader--fs" : ""}`}>
      <div className="ryven-loader__brand" aria-hidden="true">
        <span className="ryven-loader__letter">R</span>
        <span className="ryven-loader__letter">Y</span>
        <span className="ryven-loader__letter">V</span>
        <span className="ryven-loader__letter">E</span>
        <span className="ryven-loader__letter">N</span>
      </div>
      <div className="ryven-loader__bar">
        <div className="ryven-loader__fill" />
      </div>
    </div>
  );
}
