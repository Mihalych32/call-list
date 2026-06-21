export type CallType = 'incoming' | 'outgoing' | 'missed' | 'no_answer';

export interface Call {
  id: string;
  type: CallType;
  time: string;
  employee: string;
  callNumber: string;
  source: string;
  rating: number | null;
  duration: number;
}

export interface ApiCallItem {
  id: number;
  partnership_id: string;
  date: string;
  date_notime: string;
  time: number;
  from_number: string;
  from_extension: string;
  to_number: string;
  to_extension: string;
  is_skilla: number;
  status: string;
  record: string;
  line_number: string;
  line_name: string;
  in_out: 0 | 1;
  from_site: number;
  source: string;
  disconnect_reason: string;
  contact_name: string;
  contact_company: string;
  person_id: number;
  person_name: string;
  person_surname: string;
  person_avatar: string;
}

export interface GetRecordParams {
  record: string;
  partnership_id: string;
}

export interface ApiCallListResponse {
  total_rows: string;
  results: ApiCallItem[];
}

export interface GetCallListParams {
  date_start: string;
  date_end: string;
  in_out?: 0 | 1;
  status?: 'success' | 'fail';
  limit?: number;
  offset?: number;
}
