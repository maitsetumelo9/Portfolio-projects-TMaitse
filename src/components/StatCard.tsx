import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <div className={cn(
      "bg-card border-2 border-border rounded-xl p-5 transition-all duration-300 hover:border-primary/50",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
          {title}
        </span>
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className={cn(
        "text-2xl font-display font-bold",
        trend === 'up' && "text-success",
        trend === 'down' && "text-destructive",
        !trend && "text-foreground"
      )}>
        {value}
      </div>
      {subtitle && (
        <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
