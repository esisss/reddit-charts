export function estimateVotes(score: number, upvoteRatio: number) {
  const R = Math.min(0.999999, Math.max(0.000001, upvoteRatio));
  const twoRminus1 = 2 * R - 1;

  if (score === 0) {
    return { upvotes: 0, downvotes: 0 };
  }
  if (Math.abs(twoRminus1) < 1e-9) {
    const tiny = score > 0 ? 1e-6 : -1e-6;
    const R2 = Math.min(0.999999, Math.max(0.000001, R + tiny));
    const T = score / (2 * R2 - 1);
    const U = R2 * T;
    const D = T - U;
    let Ui = Math.round(U);
    let Di = Ui - score;
    if (Di < 0) {
      Di = Math.round(D);
      Ui = Di + score;
    }
    return { upvotes: Math.max(0, Ui), downvotes: Math.max(0, Di) };
  }

  const T = score / twoRminus1;
  const U = R * T;
  const D = (1 - R) * T;

  let Ui = Math.round(U);
  let Di = Ui - score;
  if (Di < 0) {
    Di = Math.round(D);
    Ui = Di + score;
  }

  Ui = Math.max(0, Ui);
  Di = Math.max(0, Di);

  return { upvotes: Ui, downvotes: Di };
}
