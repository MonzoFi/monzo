import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function RecentTransactions() {
  // Mock recent transactions data
  const recentTransactions = [
    {
      id: "TXN-001",
      type: "Swap",
      fromCurrency: "BTC",
      toCurrency: "ETH",
      amount: "₹25,000",
      status: "completed",
      timestamp: "2 mins ago",
      direction: "swap"
    },
    {
      id: "TXN-002",
      type: "Buy",
      fromCurrency: "INR",
      toCurrency: "USDT",
      amount: "₹50,000",
      status: "completed",
      timestamp: "5 mins ago",
      direction: "buy"
    },
    {
      id: "TXN-003",
      type: "Sell",
      fromCurrency: "SOL",
      toCurrency: "INR",
      amount: "₹15,000",
      status: "processing",
      timestamp: "12 mins ago",
      direction: "sell"
    },
    {
      id: "TXN-004",
      type: "Escrow",
      fromCurrency: "ETH",
      toCurrency: "INR",
      amount: "₹75,000",
      status: "pending",
      timestamp: "18 mins ago",
      direction: "escrow"
    },
    {
      id: "TXN-005",
      type: "Swap",
      fromCurrency: "BTC",
      toCurrency: "SOL",
      amount: "₹30,000",
      status: "completed",
      timestamp: "25 mins ago",
      direction: "swap"
    },
    {
      id: "TXN-006",
      type: "Buy",
      fromCurrency: "INR",
      toCurrency: "BTC",
      amount: "₹100,000",
      status: "completed",
      timestamp: "32 mins ago",
      direction: "buy"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Processing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">{status}</Badge>;
    }
  };

  const getDirectionIcon = (direction: string, status: string) => {
    if (status === "completed") {
      switch (direction) {
        case "buy":
          return <ArrowDownRight className="w-4 h-4 text-green-600" />;
        case "sell":
          return <ArrowUpRight className="w-4 h-4 text-red-600" />;
        default:
          return <TrendingUp className="w-4 h-4 text-orange-600" />;
      }
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card className="monzo-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-orange-200/30 dark:border-orange-800/30 rounded-xl hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all duration-300 hover:border-orange-300/50 hover:shadow-lg hover:scale-[1.02] interactive-element animate-slide-up hover-lift"
              style={{ animationDelay: `${transaction.id === 'TXN-001' ? '0' : transaction.id === 'TXN-002' ? '0.1' : transaction.id === 'TXN-003' ? '0.2' : transaction.id === 'TXN-004' ? '0.3' : transaction.id === 'TXN-005' ? '0.4' : '0.5'}s` }}>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  {getDirectionIcon(transaction.direction, transaction.status)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{transaction.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.fromCurrency} → {transaction.toCurrency}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{transaction.amount}</p>
                {getStatusBadge(transaction.status)}
                <p className="text-xs text-gray-500 mt-1">{transaction.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}