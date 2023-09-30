declare const window: any;

export const klaytnWallConnCheck = async () => {
  const klaytnWin = window.klaytn;
  if (klaytnWin) {
    await klaytnWin.enable();
  }
};
