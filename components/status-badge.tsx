import React from 'react';

interface StatusBadgeProps {
  status: number;
  className?: string;
}

const STATUS_TEXT: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  413: 'Payload Too Large',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const is4xx = status >= 400 && status < 500;
  const text = STATUS_TEXT[status] || `HTTP ${status}`;

  const colorStyles = is4xx
    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 dark:border-amber-500/30'
    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25 dark:border-rose-500/30';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold border ${colorStyles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${is4xx ? 'bg-amber-500' : 'bg-rose-500'}`} />
      {status} {text}
    </span>
  );
}
