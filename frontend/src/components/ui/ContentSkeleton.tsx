type ContentSkeletonProps = {
  rows?: number;
  showAvatar?: boolean;
  showButton?: boolean;
  className?: string;
};

export function ContentSkeleton({
  rows = 3,
  showAvatar = true,
  showButton = true,
  className = "",
}: ContentSkeletonProps) {
  return (
    <div className={`ui-skeleton ${className}`.trim()}>
      <div className="ui-skeleton__wrapper">
        {showAvatar ? <div className="ui-skeleton__circle" /> : null}
        <div className="ui-skeleton__line ui-skeleton__line--1" />
        <div className="ui-skeleton__line ui-skeleton__line--2" />
        {rows > 2 ? <div className="ui-skeleton__line ui-skeleton__line--3" /> : null}
        {rows > 3 ? <div className="ui-skeleton__line ui-skeleton__line--4" /> : null}
        {showButton ? <div className="ui-skeleton__button" /> : null}
      </div>
    </div>
  );
}
