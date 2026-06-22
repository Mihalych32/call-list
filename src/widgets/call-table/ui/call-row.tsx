import { memo, useState } from 'react';

import {
  getCallType,
  formatDuration,
  formatCallTime,
  getCallNumber,
  CallTypeIcon,
  CallPlayer,
} from '@/entities/call';
import type { CallRowProps } from '../model/types';
import styles from './call-table.module.scss';

export const CallRow = memo(({ call }: CallRowProps) => {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  const showPlayer = (hovered || playing) && !!call.record;

  return (
    <tr
      className={styles.row}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className={styles.cell}>
        <CallTypeIcon type={getCallType(call)} />
      </td>
      <td className={styles.cell}>{formatCallTime(call.date)}</td>
      <td className={styles.cell}>
        <img src={call.person_avatar} className={styles.avatar} alt="avatar" />
      </td>
      <td className={styles.cell}>{getCallNumber(call)}</td>
      <td className={styles.cell}>{call.source || '—'}</td>
      <td className={styles.cell}>—</td>
      <td className={styles.cell}>
        {showPlayer ? (
          <CallPlayer
            record={call.record}
            partnershipId={call.partnership_id}
            duration={call.time}
            onPlayStart={() => setPlaying(true)}
            onPlayStop={() => setPlaying(false)}
          />
        ) : (
          formatDuration(call.time)
        )}
      </td>
    </tr>
  );
});
