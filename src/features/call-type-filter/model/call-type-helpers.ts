import type { GetCallListParams } from '@/entities/call';
import type { CallTypeFilterValue } from './types';

type CallTypeApiParams = Pick<GetCallListParams, 'in_out' | 'status'>;

export const getCallTypeApiParams = (filter: CallTypeFilterValue): CallTypeApiParams => {
  switch (filter) {
    case 'incoming':  return { in_out: 1, status: 'success' };
    case 'missed':    return { in_out: 1, status: 'fail' };
    case 'outgoing':  return { in_out: 0, status: 'success' };
    case 'no_answer': return { in_out: 0, status: 'fail' };
    default:          return {};
  }
};
