import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpDown, Settings, RotateCcw, Zap, Clock, Shield } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cryptoApi } from "@/lib/cryptoApi";
import { apiRequest } from "@/lib/queryClient";
import { CryptoCurrency, SwapQuote } from "@/types/crypto";

export default function SwapInterface() {
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const { toast } = useToast();

  // Fetch cryptocurrencies
  const { data: cryptocurrencies = [] } = useQuery({
    queryKey: ["/api/cryptocurrencies"],
    queryFn: () => cryptoApi.getCryptocurrencies(),
    initialData: cryptoApi.getMockCryptocurrencies(),
  });

  // Calculate quote when inputs change
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      cryptoApi.calculateSwapQuote(fromCurrency, toCurrency, fromAmount)
        .then(setQuote)
        .catch(console.error);
    } else {
      setQuote(null);
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  // Swap mutation
  const swapMutation = useMutation({
    mutationFn: async (swapData: any) => {
      return await apiRequest("POST", "/api/swap", swapData);
    },
    onSuccess: () => {
      toast({
        title: "Swap Created",
        description: "Your swap transaction has been initiated successfully.",
      });
      setFromAmount("");
      setToAddress("");
      setQuote(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Swap Failed",
        description: error.message || "Failed to create swap transaction.",
        variant: "destructive",
      });
    },
  });

  const handleSwap = () => {
    if (!quote || !toAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter recipient address and amount.",
        variant: "destructive",
      });
      return;
    }

    swapMutation.mutate({
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount: quote.toAmount,
      toAddress,
      exchangeRate: quote.exchangeRate,
    });
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount("");
    setQuote(null);
  };

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

  return (
    <Card className="crypto-card glow-effect p-8 animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Zap className="w-6 h-6 mr-3 text-crypto-light" />
            Instant Swap
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">You Send</label>
          <div className="premium-input p-4 flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0.1"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-semibold text-white border-none outline-none placeholder:text-gray-500"
              />
              {quote && (
                <div className="text-sm text-gray-400 mt-1">
                  ≈ ₹{(parseFloat(quote.fromAmount) * 8421567).toLocaleString()}
                </div>
              )}
            </div>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-[140px] bg-transparent border-none text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-white/20">
                {cryptocurrencies.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white hover:bg-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCurrencyIcon(crypto.symbol)}</span>
                      <div>
                        <div className="font-semibold">{crypto.symbol}</div>
                        <div className="text-xs text-gray-400">{crypto.name}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            onClick={swapCurrencies}
            size="icon"
            className="w-12 h-12 bg-gradient-to-r from-crypto-blue to-crypto-teal hover:from-crypto-blue/80 hover:to-crypto-teal/80 rounded-2xl transition-all duration-300 transform hover:scale-110"
          >
            <ArrowUpDown className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">You Get</label>
          <div className="premium-input p-4 flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-2xl font-semibold text-white">
                {quote ? parseFloat(quote.toAmount).toFixed(6) : "0.0"}
              </div>
              {quote && (
                <div className="text-sm text-gray-400 mt-1">
                  ≈ ₹{(parseFloat(quote.toAmount) * 198234).toLocaleString()}
                </div>
              )}
            </div>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-[140px] bg-transparent border-none text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-white/20">
                {cryptocurrencies.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white hover:bg-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCurrencyIcon(crypto.symbol)}</span>
                      <div>
                        <div className="font-semibold">{crypto.symbol}</div>
                        <div className="text-xs text-gray-400">{crypto.name}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Recipient Address</label>
          <Input
            placeholder={`Enter ${toCurrency} address`}
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="premium-input p-4 text-white placeholder:text-gray-500 border-none"
          />
        </div>

        {/* Rate Info */}
        {quote && (
          <div className="glass-morphism rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Exchange Rate</span>
              <span className="text-white">1 {fromCurrency} = {parseFloat(quote.exchangeRate).toFixed(6)} {toCurrency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Platform Fee</span>
              <span className="text-white">{parseFloat(quote.platformFee).toFixed(6)} {fromCurrency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network Fee</span>
              <span className="text-white">{parseFloat(quote.networkFee).toFixed(6)} {toCurrency}</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-400">You'll receive</span>
              <span className="text-green-400">{parseFloat(quote.toAmount).toFixed(6)} {toCurrency}</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!quote || !toAddress || swapMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {swapMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Swap...</span>
            </div>
          ) : (
            <>
              Swap Now
              <Zap className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 pt-4">
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>5-30 mins</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              0.5% Fee
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
