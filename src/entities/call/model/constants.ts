import type { CallType, Config } from './types';

export const CONFIG: Record<CallType, Config> = {
  incoming:  { color: '#002CFB', rotate: 180 },
  outgoing:  { color: '#28A879', rotate: 0   },
  missed:    { color: '#EA1A4F', rotate: 180 },
  no_answer: { color: '#EA1A4F', rotate: 0   },
};
