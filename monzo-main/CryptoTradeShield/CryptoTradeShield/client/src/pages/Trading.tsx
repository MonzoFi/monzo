import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/Navigation";
import CryptoCard from "@/components/CryptoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  ChartCandlestick,
  Activity,
  Star,
  Filter,
  Search,
  RefreshCw,
  ArrowUpDown,
  Zap,
  Clock,
  DollarSign
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cryptoApi } from "@/lib/cryptoApi";
import { MarketRate } from "@/types/crypto";

export default function Trading() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch market data
  const { data: marketRates = [], isLoading: ratesLoading, refetch } = useQuery({
    queryKey: ["/api/market-rates"],
    queryFn: () => cryptoApi.getMarketRates(),
    initialData: cryptoApi.getMockMarketRates(),
    refetchInterval: 30000, // Refresh every 30 seconds
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  // Fetch user's trading history
  const { data: tradingHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ["/api/swaps"],
    enabled: isAuthenticated,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crypto-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-crypto-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading trading dashboard...</p>
        </div>
      </div>
    );
  }

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

  const filterAndSortRates = (rates: MarketRate[]) => {
    let filtered = rates.filter(rate => {
      const matchesSearch = !searchTerm || 
        rate.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === "gainers") {
        return matchesSearch && parseFloat(rate.change24h) > 0;
      } else if (filterBy === "losers") {
        return matchesSearch && parseFloat(rate.change24h) < 0;
      }
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_high":
          return parseFloat(b.priceInr) - parseFloat(a.priceInr);
        case "price_low":
          return parseFloat(a.priceInr) - parseFloat(b.priceInr);
        case "change_high":
          return parseFloat(b.change24h) - parseFloat(a.change24h);
        case "change_low":
          return parseFloat(a.change24h) - parseFloat(b.change24h);
        case "volume":
          return parseFloat(b.volume24h) - parseFloat(a.volume24h);
        default:
          return 0;
      }
    });
  };

  const filteredRates = filterAndSortRates(marketRates);

  const marketStats = {
    totalMarketCap: "₹12,45,67,890",
    totalVolume: "₹3,45,67,890", 
    dominance: "42.3%",
    activeCoins: filteredRates.length
  };

  const gainers = marketRates.filter(rate => parseFloat(rate.change24h) > 0).length;
  const losers = marketRates.filter(rate => parseFloat(rate.change24h) < 0).length;

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <BarChart3 className="w-8 h-8 mr-3 text-crypto-light" />
                  Advanced Trading
                </h1>
                <p className="text-gray-400">
                  Professional cryptocurrency trading with real-time market data and analytics
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Badge className="bg-green-500/20 text-green-400">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </div>
            </div>

            {/* Market Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Market Cap</p>
                      <p className="text-2xl font-bold text-white">{marketStats.totalMarketCap}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-crypto-light" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+2.4%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">24h Volume</p>
                      <p className="text-2xl font-bold text-white">{marketStats.totalVolume}</p>
                    </div>
                    <Activity className="w-8 h-8 text-crypto-light" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-sm text-red-400">-1.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">BTC Dominance</p>
                      <p className="text-2xl font-bold text-white">{marketStats.dominance}</p>
                    </div>
                    <div className="text-2xl">🟠</div>
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+0.3%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Gainers/Losers</p>
                      <p className="text-2xl font-bold text-white">{gainers}/{losers}</p>
                    </div>
                    <ArrowUpDown className="w-8 h-8 text-crypto-light" />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-400">{gainers} up</span>
                    <span className="text-sm text-gray-400 mx-2">•</span>
                    <span className="text-sm text-red-400">{losers} down</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="markets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/5">
              <TabsTrigger value="markets" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                Markets
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                My Portfolio
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                Trading History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="markets">
              <Card className="crypto-card">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <CardTitle className="flex items-center text-white">
                      <ChartCandlestick className="w-5 h-5 mr-2 text-crypto-light" />
                      Market Overview
                    </CardTitle>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search cryptocurrencies..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white w-64"
                        />
                      </div>
                      
                      {/* Filter */}
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-morphism border-white/20">
                          <SelectItem value="all" className="text-white hover:bg-white/10">All</SelectItem>
                          <SelectItem value="gainers" className="text-white hover:bg-white/10">Gainers</SelectItem>
                          <SelectItem value="losers" className="text-white hover:bg-white/10">Losers</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Sort */}
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-morphism border-white/20">
                          <SelectItem value="market_cap" className="text-white hover:bg-white/10">Market Cap</SelectItem>
                          <SelectItem value="price_high" className="text-white hover:bg-white/10">Price (High)</SelectItem>
                          <SelectItem value="price_low" className="text-white hover:bg-white/10">Price (Low)</SelectItem>
                          <SelectItem value="change_high" className="text-white hover:bg-white/10">Change (High)</SelectItem>
                          <SelectItem value="change_low" className="text-white hover:bg-white/10">Change (Low)</SelectItem>
                          <SelectItem value="volume" className="text-white hover:bg-white/10">Volume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ratesLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton h-48 rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRates.map((rate) => (
                        <CryptoCard
                          key={rate.symbol}
                          rate={rate}
                          onClick={() => {
                            toast({
                              title: "Trading Pair Selected",
                              description: `Selected ${rate.symbol} for trading`,
                            });
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {!ratesLoading && filteredRates.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                      <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Star className="w-5 h-5 mr-2 text-crypto-light" />
                    My Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Portfolio Coming Soon</h3>
                    <p className="text-gray-400 mb-6">
                      Track your crypto holdings, performance, and get personalized insights
                    </p>
                    <Button className="bg-gradient-to-r from-crypto-blue to-crypto-teal text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Start Trading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Clock className="w-5 h-5 mr-2 text-crypto-light" />
                    Trading History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton h-16 rounded-xl" />
                      ))}
                    </div>
                  ) : tradingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {tradingHistory.map((trade: any) => (
                        <div key={trade.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getCurrencyIcon(trade.fromCurrency)}</div>
                            <div>
                              <div className="font-medium text-white">
                                {trade.fromCurrency} → {trade.toCurrency}
                              </div>
                              <div className="text-sm text-gray-400">
                                {trade.fromAmount} {trade.fromCurrency} for {trade.toAmount} {trade.toCurrency}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${
                              trade.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              trade.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {trade.status}
                            </Badge>
                            <div className="text-sm text-gray-400 mt-1">
                              {new Date(trade.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Trading History</h3>
                      <p className="text-gray-400 mb-6">
                        Your completed trades will appear here
                      </p>
                      <Button className="bg-gradient-to-r from-crypto-blue to-crypto-teal text-white">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Start Trading
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
