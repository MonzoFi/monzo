import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ExternalLink, Smartphone, University, CreditCard, ArrowRightLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cryptoApi } from "@/lib/cryptoApi";
import { MarketRate } from "@/types/crypto";

export default function MarketData() {
  const { data: marketRates = [] } = useQuery({
    queryKey: ["/api/market-rates"],
    queryFn: () => cryptoApi.getMarketRates(),
    initialData: cryptoApi.getMockMarketRates(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

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
    <div className="space-y-6">
      {/* Live Rates */}
      <Card className="crypto-card animate-slide-up">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl font-bold text-white">
            <TrendingUp className="w-5 h-5 mr-3 text-green-400" />
            Live Market Rates
            <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-400 text-xs">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketRates.map((rate) => {
            const change = parseFloat(rate.change24h);
            const isPositive = change >= 0;
            
            return (
              <div
                key={rate.symbol}
                className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getCurrencyIcon(rate.symbol)}</div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-crypto-light transition-colors">
                      {rate.symbol === "BTC" && "Bitcoin"}
                      {rate.symbol === "ETH" && "Ethereum"}
                      {rate.symbol === "SOL" && "Solana"}
                    </div>
                    <div className="text-sm text-gray-400">{rate.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg text-white">
                    {formatPrice(rate.priceInr)}
                  </div>
                  <div className={`text-sm flex items-center ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {formatChange(rate.change24h)}
                  </div>
                </div>
              </div>
            );
          })}
          
          <Button
            variant="ghost"
            className="w-full mt-4 text-crypto-light hover:text-white hover:bg-white/10 transition-colors"
          >
            View All Rates
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* INR Payment Methods */}
      <Card className="crypto-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl font-bold text-white">
            <span className="text-2xl mr-3">₹</span>
            INR Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors cursor-pointer group">
              <Smartphone className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-white">UPI</div>
              <div className="text-xs text-gray-400">Instant</div>
              <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-400 text-xs">
                Most Popular
              </Badge>
            </div>
            
            <div className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors cursor-pointer group">
              <University className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-white">Bank Transfer</div>
              <div className="text-xs text-gray-400">1-2 hours</div>
            </div>
            
            <div className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors cursor-pointer group">
              <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-white">Cards</div>
              <div className="text-xs text-gray-400">Instant</div>
            </div>
            
            <div className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors cursor-pointer group">
              <ArrowRightLeft className="w-8 h-8 text-teal-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-white">IMPS</div>
              <div className="text-xs text-gray-400">15 mins</div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-gradient-to-r from-crypto-blue/20 to-crypto-teal/20 rounded-xl border border-crypto-light/20">
            <div className="text-sm text-white font-medium mb-1">
              💡 Pro Tip
            </div>
            <div className="text-xs text-gray-300">
              UPI payments are processed instantly with zero additional fees. Perfect for quick trades!
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Stats */}
      <Card className="crypto-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl font-bold text-white">
            <TrendingUp className="w-5 h-5 mr-3 text-crypto-light" />
            Today's Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-crypto-light">₹12.5Cr</div>
              <div className="text-sm text-gray-400">24h Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">2,847</div>
              <div className="text-sm text-gray-400">Active Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">99.8%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">1.2s</div>
              <div className="text-sm text-gray-400">Avg. Speed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
