'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  description = "vs last month", 
  trend, 
  className
}: KPICardProps) {
  return (
    <Card className={cn(
      "bg-surface dark:bg-surface border border-border-brand dark:border-border-brand rounded-card shadow-card p-5 md:p-6 transition-all hover:shadow-md", 
      className
    )}>
      <div className="flex flex-col gap-2">
        {/* Title / Label */}
        <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
          {title}
        </span>
        
        {/* Value */}
        <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-text-primary">
          {value}
        </div>
        
        {/* Trend Delta Pill */}
        {trend && (
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
              trend.isPositive 
                ? "bg-green-500/10 text-positive" 
                : "bg-red-500/10 text-negative"
            )}>
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}%
            </span>
            <span className="text-xs text-text-secondary">
              {description}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
