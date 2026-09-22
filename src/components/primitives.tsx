export function ArtStudy({
  kind = "fold",
  className = "",
}: {
  kind?: string;
  className?: string;
}) {
  return (
    <div className={`art-study art-${kind} ${className}`} aria-hidden="true">
      <div className="art-light" />
      <div className="art-object">
        <i />
        <i />
        <i />
      </div>
      <div className="art-grain" />
    </div>
  );
}
export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="arrow-link" href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
