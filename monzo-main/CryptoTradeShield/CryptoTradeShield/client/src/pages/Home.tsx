import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import SwapInterface from "@/components/SwapInterface";
import MarketData from "@/components/MarketData";
import RecentTransactions from "@/components/RecentTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ArrowRightLeft, 
  Shield, 
  Clock, 
  Wallet,
  Bell
} from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg dark:animated-bg-dark floating-orbs flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Instant Swap",
      description: "Exchange cryptocurrencies instantly",
      icon: ArrowRightLeft,
      href: "/",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "P2P Escrow",
      description: "Secure peer-to-peer trading",
      icon: Shield,
      href: "/escrow",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Trading Center",
      description: "Advanced trading tools",
      icon: TrendingUp,
      href: "/trading",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen animated-bg dark:animated-bg-dark floating-orbs text-white">
      {/* Animated Particle Background */}
      <div className="particle-bg">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, Trader! 👋
                </h1>
                <p className="text-gray-300">
                  Ready to trade? Your portfolio is performing well today.
                </p>
              </div>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" style={{ backgroundColor: '#e67913' }}>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="monzo-card animate-bounce-in hover-lift interactive-element enhanced-button glow-border stagger-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</p>
                      <p className="text-2xl font-bold text-gradient">₹2,45,670</p>
                    </div>
                    <div className="floating-element">
                      <Wallet className="w-8 h-8 text-orange-500 pulse-glow particle-dance" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1 animate-wiggle" />
                    <span className="text-sm text-green-500">+12.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="monzo-card animate-bounce-in hover-lift interactive-element enhanced-button glow-border stagger-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
                      <p className="text-2xl font-bold text-gradient">47</p>
                    </div>
                    <div className="floating-element">
                      <ArrowRightLeft className="w-8 h-8 text-orange-500 pulse-glow particle-dance" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-500">This month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="monzo-card animate-bounce-in hover-lift interactive-element enhanced-button glow-border stagger-3">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Escrows</p>
                      <p className="text-2xl font-bold text-gradient">3</p>
                    </div>
                    <div className="floating-element">
                      <Shield className="w-8 h-8 text-orange-500 pulse-glow particle-dance" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1 animate-wiggle" />
                    <span className="text-sm text-green-500">All secured</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="monzo-card animate-bounce-in hover-lift interactive-element enhanced-button glow-border stagger-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold text-gradient">98.2%</p>
                    </div>
                    <div className="floating-element">
                      <TrendingUp className="w-8 h-8 text-orange-500 pulse-glow particle-dance" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Shield className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">Excellent</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Trading Tools */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="monzo-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <a key={index} href={action.href}>
                        <Card className="monzo-card cursor-pointer group hover:scale-105 transition-all duration-300 animate-slide-up hover-lift interactive-element enhanced-button" style={{ animationDelay: `${index * 0.1}s` }}>
                          <CardContent className="p-6 text-center">
                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 pulse-glow`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gradient transition-all duration-300">{action.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors duration-300">{action.description}</p>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Swap Interface */}
              <SwapInterface />

              {/* Recent Transactions */}
              <RecentTransactions />
            </div>

            {/* Right Column - Market Data & Tools */}
            <div className="space-y-6">
              <MarketData />
              
              {/* Account Settings Quick Access */}
              <Card className="monzo-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-orange-200/50 dark:border-orange-800/50 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">KYC Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-orange-200/50 dark:border-orange-800/50 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">2FA Security</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-orange-200/50 dark:border-orange-800/50 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Account Tier</span>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        Premium
                      </Badge>
                    </div>
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