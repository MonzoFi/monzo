import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import monzoLogo from "@assets/monzo_1750959119738.jpg";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock admin data
  const adminStats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Trading Volume",
      value: "₹2.4Cr",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Active Escrows",
      value: "234",
      change: "+5.1%",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Platform Revenue",
      value: "₹45.2L",
      change: "+18.7%",
      icon: DollarSign,
      color: "text-purple-600"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      user: "rajesh.kumar@gmail.com",
      type: "Swap",
      amount: "₹25,000",
      crypto: "BTC → ETH",
      status: "completed",
      timestamp: "2 mins ago"
    },
    {
      id: "TXN-002",
      user: "priya.sharma@gmail.com",
      type: "Escrow",
      amount: "₹50,000",
      crypto: "USDT → INR",
      status: "pending",
      timestamp: "5 mins ago"
    },
    {
      id: "TXN-003",
      user: "amit.patel@gmail.com",
      type: "Buy",
      amount: "₹15,000",
      crypto: "SOL",
      status: "completed",
      timestamp: "12 mins ago"
    },
    {
      id: "TXN-004",
      user: "sneha.gupta@gmail.com",
      type: "Sell",
      amount: "₹75,000",
      crypto: "ETH → INR",
      status: "processing",
      timestamp: "18 mins ago"
    },
    {
      id: "TXN-005",
      user: "vikram.singh@gmail.com",
      type: "Swap",
      amount: "₹30,000",
      crypto: "BTC → SOL",
      status: "completed",
      timestamp: "25 mins ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={monzoLogo} 
                alt="Monzo Logo" 
                className="w-8 h-8 rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Monzo Admin
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platform Management Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Super Admin
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{transaction.id}</span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.user}</p>
                          <p className="text-xs text-gray-500">{transaction.crypto}</p>
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

              {/* Platform Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-gray-500">priya.sharma@gmail.com - 3 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">KYC verification completed</p>
                        <p className="text-xs text-gray-500">rajesh.kumar@gmail.com - 8 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Escrow dispute raised</p>
                        <p className="text-xs text-gray-500">Trade ID: ESC-4521 - 15 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">High volume transaction</p>
                        <p className="text-xs text-gray-500">₹5,00,000 BTC purchase - 22 mins ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{transaction.id}</span>
                          <Badge variant="outline">
                            {transaction.type}
                          </Badge>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{transaction.user}</p>
                        <p className="text-sm text-gray-500">{transaction.crypto}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">{transaction.amount}</p>
                        <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Platform configuration settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}