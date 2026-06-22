import {memo} from 'react';
import type { CallTypeIconProps } from '../../model/types';
import { CONFIG } from '../../model/constants';

export const CallTypeIcon = memo(({ type, size = 16 }: CallTypeIconProps) => {
  const { color, rotate } = CONFIG[type];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0 }}
    >
      <path
        d="M4 12L12 4M7 4H12V9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}, (prev, next) => prev.type === next.type);
