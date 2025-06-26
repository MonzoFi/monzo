import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/Navigation";
import EscrowInterface from "@/components/EscrowInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Users,
  Handshake,
  TrendingUp,
  ArrowRightLeft
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EscrowTrade } from "@/types/crypto";

export default function Escrow() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("active");

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

  // Fetch user's escrow trades
  const { data: escrowTrades = [], isLoading: tradesLoading, refetch } = useQuery({
    queryKey: ["/api/escrows"],
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
          <p className="text-white">Loading escrow dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'created':
        return 'bg-blue-500/20 text-blue-400';
      case 'accepted':
        return 'bg-purple-500/20 text-purple-400';
      case 'funded':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'paid':
        return 'bg-orange-500/20 text-orange-400';
      case 'dispute':
        return 'bg-red-500/20 text-red-400';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'created':
      case 'accepted':
      case 'funded':
        return <Clock className="w-4 h-4" />;
      case 'dispute':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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

  const filterTrades = (trades: EscrowTrade[], tab: string) => {
    const filtered = trades.filter(trade => {
      const matchesSearch = !searchTerm || 
        trade.cryptocurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.id.toString().includes(searchTerm);
      
      switch (tab) {
        case 'active':
          return matchesSearch && ['created', 'accepted', 'funded', 'paid'].includes(trade.status);
        case 'completed':
          return matchesSearch && trade.status === 'completed';
        case 'disputes':
          return matchesSearch && trade.status === 'dispute';
        case 'all':
        default:
          return matchesSearch;
      }
    });
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredTrades = filterTrades(escrowTrades, selectedTab);

  const stats = {
    total: escrowTrades.length,
    active: escrowTrades.filter(t => ['created', 'accepted', 'funded', 'paid'].includes(t.status)).length,
    completed: escrowTrades.filter(t => t.status === 'completed').length,
    disputes: escrowTrades.filter(t => t.status === 'dispute').length,
  };

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
                  <Shield className="w-8 h-8 mr-3 text-green-400" />
                  Secure Escrow Trading
                </h1>
                <p className="text-gray-400">
                  Trade safely with automated escrow protection and dispute resolution
                </p>
              </div>
              <Button 
                onClick={() => document.getElementById('create-escrow')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Trade
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Trades</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <Handshake className="w-8 h-8 text-crypto-light" />
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Trades</p>
                      <p className="text-2xl font-bold text-white">{stats.active}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Completed</p>
                      <p className="text-2xl font-bold text-white">{stats.completed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Trades List */}
            <div className="lg:col-span-2">
              <Card className="crypto-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-white">
                      <Users className="w-5 h-5 mr-2 text-crypto-light" />
                      My Escrow Trades
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search trades..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white w-64"
                        />
                      </div>
                      <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-4 bg-white/5">
                      <TabsTrigger value="active" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                        Active ({stats.active})
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                        Completed ({stats.completed})
                      </TabsTrigger>
                      <TabsTrigger value="disputes" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                        Disputes ({stats.disputes})
                      </TabsTrigger>
                      <TabsTrigger value="all" className="data-[state=active]:bg-crypto-light data-[state=active]:text-white">
                        All ({stats.total})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={selectedTab} className="mt-6">
                      {tradesLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton h-24 rounded-xl" />
                          ))}
                        </div>
                      ) : filteredTrades.length > 0 ? (
                        <div className="space-y-4">
                          {filteredTrades.map((trade) => (
                            <Card key={trade.id} className="crypto-card hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="text-2xl">{getCurrencyIcon(trade.cryptocurrency)}</div>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-white">
                                          {trade.type.toUpperCase()} {trade.cryptocurrency}
                                        </span>
                                        <Badge className={getStatusColor(trade.status)}>
                                          {getStatusIcon(trade.status)}
                                          <span className="ml-1">{trade.status}</span>
                                        </Badge>
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {trade.cryptoAmount} {trade.cryptocurrency} ↔ ₹{trade.inrAmount}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Created {new Date(trade.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                      <div className="text-sm text-gray-400">Payment Method</div>
                                      <div className="font-medium text-white capitalize">
                                        {trade.paymentMethod.replace('_', ' ')}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-crypto-light hover:bg-white/10"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {trade.status === 'created' && trade.creatorId === user?.id && (
                                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <p className="text-sm text-blue-400">
                                      Waiting for counterparty to accept this trade
                                    </p>
                                  </div>
                                )}
                                
                                {trade.status === 'dispute' && (
                                  <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <div className="flex items-center space-x-2">
                                      <AlertCircle className="w-4 h-4 text-red-400" />
                                      <p className="text-sm text-red-400">
                                        Trade is under dispute resolution
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {selectedTab === 'active' ? 'No Active Trades' : 
                             selectedTab === 'completed' ? 'No Completed Trades' :
                             selectedTab === 'disputes' ? 'No Disputes' : 'No Trades Found'}
                          </h3>
                          <p className="text-gray-400 mb-6">
                            {selectedTab === 'active' ? 'Create your first escrow trade to get started' :
                             'Trade history will appear here'}
                          </p>
                          {selectedTab === 'active' && (
                            <Button 
                              onClick={() => document.getElementById('create-escrow')?.scrollIntoView({ behavior: 'smooth' })}
                              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Trade
                            </Button>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Create Escrow */}
            <div id="create-escrow">
              <EscrowInterface />
              
              {/* How Escrow Works */}
              <Card className="crypto-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Create Trade",
                        description: "Set up trade parameters and invite counterparty"
                      },
                      {
                        step: 2,
                        title: "Funds Locked",
                        description: "Crypto is secured in escrow wallet"
                      },
                      {
                        step: 3,
                        title: "Payment Made",
                        description: "Buyer transfers INR to seller"
                      },
                      {
                        step: 4,
                        title: "Funds Released",
                        description: "Crypto released to buyer automatically"
                      }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-crypto-light rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.title}</div>
                          <div className="text-sm text-gray-400">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
