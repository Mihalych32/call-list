import { useState, useRef, useEffect } from 'react';
import { useLazyGetRecordQuery } from '../../api/call-api';
import styles from './call-player.module.scss';

interface CallPlayerProps {
  record: string;
  partnershipId: string;
  duration: number;
  onPlayStart: () => void;
  onPlayStop: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const PlayIcon = () => (
  <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
    <path d="M0 0L8 5L0 10V0Z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="2" width="3.5" height="10" rx="1" fill="currentColor" />
    <rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="currentColor" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v8M4 6.5l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.spinner}>
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="8 20" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CallPlayer = ({ record, partnershipId, duration, onPlayStart, onPlayStop }: CallPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlay = useRef(false);

  const [fetchRecord, { data: audioUrl, isLoading, isError }] = useLazyGetRecordQuery();

  useEffect(() => {
    if (audioUrl && audioRef.current && shouldAutoPlay.current) {
      shouldAutoPlay.current = false;
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const handlePlay = async () => {
    if (isLoading) return;
    if (audioUrl) {
      togglePlayPause();
      return;
    }
    shouldAutoPlay.current = true;
    await fetchRecord({ record, partnership_id: partnershipId });
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    onPlayStop();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const handleDownload = async () => {
    let url = audioUrl;
    if (!url) {
      const result = await fetchRecord({ record, partnership_id: partnershipId });
      url = result.data;
    }
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.player} onClick={(e) => e.stopPropagation()}>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onPlay={() => { setIsPlaying(true); onPlayStart(); }}
          onPause={() => { setIsPlaying(false); onPlayStop(); }}
          onEnded={() => { setIsPlaying(false); setCurrentTime(0); onPlayStop(); }}
        />
      )}

      <span className={styles.duration}>{formatTime(duration)}</span>

      <button type="button" className={`${styles.btn} ${styles.playBtn}`} onClick={handlePlay} disabled={isLoading || isError} title={isError ? 'Ошибка загрузки записи' : undefined}>
        {isLoading ? <SpinnerIcon /> : isError ? <ErrorIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className={styles.progressBar} onClick={handleProgressClick}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <button type="button" className={styles.btn} onClick={handleDownload}>
        <DownloadIcon />
      </button>

      {isPlaying && (
        <button type="button" className={styles.btn} onClick={handleReset}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
