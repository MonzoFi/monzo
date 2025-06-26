import { useState } from "react";

interface CryptoIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function CryptoIcon({ symbol, size = "md", className = "" }: CryptoIconProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const getIconUrl = (symbol: string) => {
    const iconMap: Record<string, string> = {
      BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
      USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
      MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
      AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
      LINK: "https://cryptologos.cc/logos/chainlink-link-logo.png",
      UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
      ATOM: "https://cryptologos.cc/logos/cosmos-atom-logo.png",
      FTM: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
      NEAR: "https://cryptologos.cc/logos/near-protocol-near-logo.png",
    };
    return iconMap[symbol.toUpperCase()];
  };

  const getFallbackIcon = (symbol: string) => {
    const colors = {
      BTC: "bg-orange-500",
      ETH: "bg-blue-500", 
      SOL: "bg-purple-500",
      USDT: "bg-green-500",
      LTC: "bg-gray-500",
      BNB: "bg-yellow-500",
      ADA: "bg-blue-600",
      MATIC: "bg-purple-600",
      DOT: "bg-pink-500",
      AVAX: "bg-red-500",
      LINK: "bg-blue-400",
      UNI: "bg-pink-400",
      ATOM: "bg-purple-400",
      FTM: "bg-blue-300",
      NEAR: "bg-gray-400",
    };
    
    const bgColor = colors[symbol.toUpperCase() as keyof typeof colors] || "bg-gray-500";
    
    return (
      <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center ${className}`}>
        <span className="text-white font-bold text-xs">
          {symbol.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  };

  const iconUrl = getIconUrl(symbol);
  
  if (!iconUrl || imageError) {
    return getFallbackIcon(symbol);
  }

  return (
    <img
      src={iconUrl}
      alt={`${symbol} icon`}
      className={`${sizeClasses[size]} rounded-full ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}