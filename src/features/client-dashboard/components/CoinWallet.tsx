interface CoinWalletProps {
  coins: number;
  size?: 'sm' | 'md';
}

const CoinWallet = ({ coins, size = 'sm' }: CoinWalletProps) => (
  <div className={`coin-badge ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}`}>
    <span>🪙</span>
    <span>{coins.toLocaleString()}</span>
  </div>
);

export default CoinWallet;
