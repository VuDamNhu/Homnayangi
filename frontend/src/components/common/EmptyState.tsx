interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      {icon && (
        <div className="text-zen-gold/40 [&>svg]:w-12 [&>svg]:h-12">{icon}</div>
      )}
      <div className="space-y-2">
        <h3 className="font-display text-xl font-black uppercase italic text-on-surface">
          {title}
        </h3>
        {description && (
          <p className="font-body text-sm text-on-surface-variant max-w-sm">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
