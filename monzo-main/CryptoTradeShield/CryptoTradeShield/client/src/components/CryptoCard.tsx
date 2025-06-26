import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MarketRate } from "@/types/crypto";

interface CryptoCardProps {
  rate: MarketRate;
  onClick?: () => void;
}

export default function CryptoCard({ rate, onClick }: CryptoCardProps) {
  const change = parseFloat(rate.change24h);
  const isPositive = change >= 0;

  const getCurrencyIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      BTC: "🟠",
      ETH: "🔵",
      SOL: "🟣",
      LTC: "⚪",
      BNB: "🟡",
    };
    return icons[symbol] || "⚫";
  };

  const getCurrencyName = (symbol: string) => {
    const names: Record<string, string> = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      SOL: "Solana",
      LTC: "Litecoin",
      BNB: "Binance Coin",
    };
    return names[symbol] || symbol;
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatChange = (change: string) => {
    const numChange = parseFloat(change);
    return numChange >= 0 ? `+${numChange.toFixed(2)}%` : `${numChange.toFixed(2)}%`;
  };

  return (
    <Card 
      className="crypto-card cursor-pointer hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getCurrencyIcon(rate.symbol)}</div>
            <div>
              <h3 className="font-bold text-lg text-white">{getCurrencyName(rate.symbol)}</h3>
              <p className="text-sm text-gray-400">{rate.symbol}</p>
            </div>
          </div>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={`${
              isPositive 
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {formatChange(rate.change24h)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Price (INR)</span>
            <span className="font-semibold text-white">
              {formatPrice(rate.priceInr)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Price (USD)</span>
            <span className="font-semibold text-white">
              ${parseFloat(rate.priceUsd).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">24h Volume</span>
            <span className="font-semibold text-white">
              ₹{(parseFloat(rate.volume24h) / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live Price</span>
            <span>•</span>
            <span>Updated {new Date(rate.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
