import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  Plus,
  Check,
  Clock,
  AlertCircle,
  ArrowRight,
  Shield,
  Zap,
  RefreshCw
} from "lucide-react";

export default function Payments() {
  const [activeTab, setActiveTab] = useState("methods");

  const paymentMethods = [
    {
      id: 1,
      type: "UPI",
      name: "Google Pay",
      identifier: "monzo@okaxis",
      icon: Smartphone,
      isVerified: true,
      isDefault: true,
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      type: "Bank Transfer",
      name: "HDFC Bank",
      identifier: "****1234",
      icon: Building2,
      isVerified: true,
      isDefault: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 3,
      type: "Wallet",
      name: "Paytm Wallet",
      identifier: "+91-98765****",
      icon: Wallet,
      isVerified: false,
      isDefault: false,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const transactions = [
    {
      id: 1,
      type: "deposit",
      amount: "₹25,000",
      method: "UPI - Google Pay",
      status: "completed",
      date: "2024-01-20",
      time: "14:30",
      txnId: "TXN123456789"
    },
    {
      id: 2,
      type: "withdrawal",
      amount: "₹15,000",
      method: "Bank Transfer - HDFC",
      status: "processing",
      date: "2024-01-19",
      time: "16:45",
      txnId: "TXN123456788"
    },
    {
      id: 3,
      type: "deposit",
      amount: "₹50,000",
      method: "IMPS - SBI",
      status: "completed",
      date: "2024-01-18",
      time: "10:15",
      txnId: "TXN123456787"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
          <Check className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case "processing":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50">
          <Clock className="w-3 h-3 mr-1" />
          Processing
        </Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-400/50">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark animated-bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
            Payment Methods & History
          </h1>
          <p className="text-gray-400">
            Manage your payment methods and view transaction history
          </p>
        </div>

        {/* How Payments Work - Info Card */}
        <Card className="monzo-card mb-8 animate-bounce-in border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="w-6 h-6 mr-3 text-orange-500" />
              How Payment Processing Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-400 mb-3">For Buyers (INR Deposits):</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Add your preferred payment method (UPI, Bank Transfer, IMPS)
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Deposit INR to your Monzo wallet using verified methods
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Use wallet balance to buy cryptocurrencies instantly
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    All payments are secured with bank-grade encryption
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-3">For Sellers (INR Withdrawals):</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Sell cryptocurrencies to get INR in your wallet
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Withdraw to your verified bank account or UPI
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Fast processing - usually within 30 minutes
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Real-time notifications for all transactions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-orange-500/20">
            <TabsTrigger 
              value="methods" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
            >
              Payment Methods
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
            >
              Transaction History
            </TabsTrigger>
            <TabsTrigger 
              value="add" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
            >
              Add Method
            </TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="mt-6">
            <div className="grid gap-4">
              {paymentMethods.map((method, index) => (
                <Card key={method.id} className="monzo-card animate-slide-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center`}>
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{method.name}</h3>
                            {method.isDefault && (
                              <Badge className="bg-orange-500/20 text-orange-400 text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{method.type} • {method.identifier}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {method.isVerified ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="monzo-card">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((txn, index) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 border border-orange-500/20 rounded-xl hover:bg-orange-500/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          txn.type === 'deposit' ? 'bg-green-500/20' : 'bg-blue-500/20'
                        }`}>
                          {txn.type === 'deposit' ? (
                            <ArrowRight className="w-5 h-5 text-green-400 rotate-90" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-blue-400 -rotate-90" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white capitalize">{txn.type}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-lg font-bold text-white">{txn.amount}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {txn.method} • {txn.date} at {txn.time}
                          </div>
                          <div className="text-xs text-gray-500">ID: {txn.txnId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(txn.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="monzo-card">
                <CardHeader>
                  <CardTitle className="text-white">Add UPI Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upi-id" className="text-gray-300">UPI ID</Label>
                    <Input 
                      id="upi-id" 
                      placeholder="yourname@upi" 
                      className="bg-gray-800/50 border-orange-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="upi-name" className="text-gray-300">Account Holder Name</Label>
                    <Input 
                      id="upi-name" 
                      placeholder="Full name as per bank account" 
                      className="bg-gray-800/50 border-orange-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add UPI Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="monzo-card">
                <CardHeader>
                  <CardTitle className="text-white">Add Bank Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="account-number" className="text-gray-300">Account Number</Label>
                    <Input 
                      id="account-number" 
                      placeholder="1234567890" 
                      className="bg-gray-800/50 border-orange-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc-code" className="text-gray-300">IFSC Code</Label>
                    <Input 
                      id="ifsc-code" 
                      placeholder="HDFC0000123" 
                      className="bg-gray-800/50 border-orange-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account-holder" className="text-gray-300">Account Holder Name</Label>
                    <Input 
                      id="account-holder" 
                      placeholder="Full name as per bank" 
                      className="bg-gray-800/50 border-orange-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bank Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Security Features */}
        <Card className="monzo-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="w-6 h-6 mr-3 text-green-400" />
              Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Bank-Grade Security</h4>
                <p className="text-sm text-gray-400">256-bit SSL encryption and multi-factor authentication</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">RBI Compliant</h4>
                <p className="text-sm text-gray-400">Fully compliant with Indian banking regulations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Instant Processing</h4>
                <p className="text-sm text-gray-400">Real-time transaction processing and notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}