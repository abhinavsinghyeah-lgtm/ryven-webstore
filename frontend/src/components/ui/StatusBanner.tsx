type StatusBannerProps = {
  variant?: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
};

const variantClassMap = {
  success: "status-banner--success",
  info: "status-banner--info",
  warning: "status-banner--warning",
  error: "status-banner--error",
};

export function StatusBanner({ variant = "info", title, description }: StatusBannerProps) {
  return (
    <div className={`status-banner ${variantClassMap[variant]}`} role="status" aria-live="polite">
      <div className="status-banner__icon">i</div>
      <div>
        <p className="status-banner__title">{title}</p>
        {description ? <p className="status-banner__description">{description}</p> : null}
      </div>
    </div>
  );
}
