import {memo} from 'react';
import type { CallType } from '../../model/types';

interface Config {
  color: string;
  rotate: number;
}

const CONFIG: Record<CallType, Config> = {
  incoming:  { color: '#002CFB', rotate: 180 },
  outgoing:  { color: '#28A879', rotate: 0   },
  missed:    { color: '#EA1A4F', rotate: 180 },
  no_answer: { color: '#EA1A4F', rotate: 0   },
};

interface CallTypeIconProps {
  type: CallType;
  size?: number;
}

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
