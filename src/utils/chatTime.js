export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

export const formatKDate = (d) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

export const formatKTime = (d) =>
  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export function computeTimeLabels(now, prev) {
  const diff = prev ? now - new Date(prev.createdAt) : Infinity;
  const showDate = diff >= DAY || !prev;
  const showTime = diff >= HOUR || showDate;
  return {
    showDate,
    dateLabel: showDate ? formatKDate(now) : '',
    showTime,
    timeLabel: showTime ? formatKTime(now) : '',
  };
}