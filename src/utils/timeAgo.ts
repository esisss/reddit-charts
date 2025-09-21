function timeAgo(utcSec: number) {
  const diff = Date.now() - utcSec * 1000;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m`;

  const h = Math.floor(diff / 3_600_000);
  if (h < 24) return `${h}h`;

  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default timeAgo;
