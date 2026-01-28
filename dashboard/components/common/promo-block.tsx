'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PromoBlockProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  variant?: 'default' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

const variants = {
  default: 'bg-muted/50 border',
  gradient: 'bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20',
  outline: 'bg-transparent border-2 border-dashed border-muted-foreground/20',
};

const sizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function PromoBlock({
  title,
  description,
  icon: Icon = Sparkles,
  ctaText,
  ctaHref,
  onCtaClick,
  variant = 'gradient',
  size = 'md',
  className,
  children,
}: PromoBlockProps) {
  const hasAction = ctaText && (ctaHref || onCtaClick);

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          {children}
          {hasAction && (
            <div className="mt-4">
              {ctaHref ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={ctaHref}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={onCtaClick}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
