let draftContext = {
  blueWinChance: 50,
  draftMode: 'simulation',
  bluePicks: 'none',
  redPicks: 'none',
};

export function setDraftContext(ctx) {
  draftContext = { ...draftContext, ...ctx };
}

export function getDraftContext() {
  return draftContext;
}
