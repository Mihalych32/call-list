import type { ApiCallItem, CallType } from './types';

export const getCallType = (call: ApiCallItem): CallType => {
  if (call.in_out === 1) {
    return call.time > 0 ? 'incoming' : 'missed';
  }
  return call.time > 0 ? 'outgoing' : 'no_answer';
};

export const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatCallTime = (dateStr: string): string => {
  return dateStr.split(' ')[1]?.substring(0, 5) ?? dateStr;
};

export const getCallNumber = (call: ApiCallItem): string => {
  return call.in_out === 1 ? call.from_number : call.to_number;
};
