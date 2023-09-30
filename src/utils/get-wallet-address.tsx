export const walletAddress = () => {
  const address = localStorage.getItem('Wallet Address');
  return address;
};
