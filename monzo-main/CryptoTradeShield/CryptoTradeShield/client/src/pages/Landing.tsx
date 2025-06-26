import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  ArrowRightLeft, 
  Shield, 
  TrendingUp, 
  Smartphone, 
  University, 
  CreditCard, 
  Headphones,
  ChevronRight,
  Check,
  Star,
  Users,
  Clock,
  BarChart3,
  Zap,
  Lock,
  Globe,
  Twitter,
  Send,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cryptoApi } from "@/lib/cryptoApi";
import CryptoIcon from "@/components/CryptoIcon";
import monzoLogo from "@assets/monzo_1750959119738.jpg";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch market data for display
  const { data: marketRates = [] } = useQuery({
    queryKey: ["/api/market-rates"],
    queryFn: () => cryptoApi.getMarketRates(),
    initialData: cryptoApi.getMockMarketRates(),
  });

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Automated middleman service for P2P trades with dispute resolution and fund protection",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Smartphone,
      title: "INR Integration", 
      description: "Seamless INR-to-crypto conversions with UPI, bank transfers, and instant settlements",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "2FA, SSL encryption, cold storage, and advanced fraud protection for your assets",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time market data, price alerts, and advanced trading indicators",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support with live chat and dedicated account managers",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Coins,
      title: "20+ Cryptocurrencies",
      description: "Support for major cryptocurrencies including BTC, ETH, SOL, and emerging tokens",
      color: "from-indigo-500 to-blue-600"
    }
  ];

  const stats = [
    { label: "Active Users", value: "500K+", icon: Users },
    { label: "Trading Volume", value: "₹10Cr+", icon: TrendingUp },
    { label: "Uptime", value: "99.9%", icon: Clock },
    { label: "Support", value: "24/7", icon: Headphones }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Crypto Trader",
      content: "CryptoX has revolutionized my trading experience. The escrow feature gives me confidence in P2P trades.",
      avatar: "RK",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "DeFi Investor",
      content: "The INR integration is seamless. I can easily convert my crypto to INR using UPI instantly.",
      avatar: "PS", 
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Business Owner",
      content: "Best crypto platform in India. The security features and customer support are outstanding.",
      avatar: "AP",
      rating: 5
    }
  ];

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
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={monzoLogo} 
                alt="Monzo Logo" 
                className="w-10 h-10 rounded-xl shadow-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent">
                Monzo
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white hover:text-crypto-light transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-white hover:text-crypto-light transition-colors font-medium">How it Works</a>
              <a href="#security" className="text-white hover:text-crypto-light transition-colors font-medium">Security</a>
              <a href="#support" className="text-white hover:text-crypto-light transition-colors font-medium">Support</a>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="hidden md:flex text-white hover:text-crypto-light hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-crypto-blue to-crypto-teal hover:from-crypto-blue/80 hover:to-crypto-teal/80 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-6 py-3 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-sm font-semibold mb-8 neon-glow">
                ✨ India's Premier Crypto Exchange
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight matrix-bg">
              <span className="text-white floating-element">Advanced Crypto Trading</span><br/>
              <span className="text-gradient pulse-glow">& Secure Escrow</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Trade cryptocurrencies instantly with our premium platform. Military-grade escrow protection, 
              lightning-fast INR integration, and 20+ major cryptocurrencies with the lowest fees in India.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>500K+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>₹10Cr+ Volume</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={handleLogin}
                size="lg"
                className="monzo-button px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl pulse-glow animate-fade-in-scale shimmer-effect"
              >
                Start Trading Now
                <ArrowRightLeft className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  // Scroll to demo section or open demo modal
                  const demoSection = document.getElementById('features');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-[#ff810b] border-2 border-[#ff810b] text-white hover:bg-[#e6730a] hover:border-[#e6730a] px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 pulse-glow shimmer-effect"
                style={{ background: '#ff810b' }}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
          
          {/* Live Market Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {marketRates.slice(0, 3).map((rate, index) => {
              const change = parseFloat(rate.change24h);
              const isPositive = change >= 0;
              
              return (
                <Card 
                  key={rate.symbol} 
                  className="glass-card hover:neon-glow transition-all duration-500 cursor-pointer group animate-slide-up hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 pulse-glow">
                          {rate.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg group-hover:text-gradient transition-all duration-300">{rate.symbol}</div>
                          <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                            {rate.symbol === "BTC" && "Bitcoin"}
                            {rate.symbol === "ETH" && "Ethereum"}
                            {rate.symbol === "SOL" && "Solana"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`px-3 py-1 font-semibold text-sm transition-all duration-300 hover:scale-110 ${
                          isPositive 
                            ? "bg-green-500/30 text-green-300 border-green-400/50 hover:bg-green-500/40" 
                            : "bg-red-500/30 text-red-300 border-red-400/50 hover:bg-red-500/40"
                        }`}
                      >
                        {isPositive ? "+" : ""}{change.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="text-3xl font-black text-white mb-2 group-hover:text-gradient transition-all duration-300">
                      ₹{parseFloat(rate.priceInr).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      Volume: ₹{parseFloat(rate.volume24h).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Advanced Trading Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience next-generation cryptocurrency trading with our comprehensive suite of premium features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="crypto-card text-center group animate-bounce-in hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 pulse-glow`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gradient transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors duration-300">{feature.description}</p>
                  <Button
                    variant="ghost"
                    className="text-crypto-light hover:text-white hover:bg-white/10 shimmer-effect transition-all duration-300 hover:scale-105"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Escrow Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              How Secure Escrow Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trade with confidence using our automated escrow system that protects both buyers and sellers
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Create Trade Room",
                  description: "Set up your trade parameters and invite your counterparty to a secure trading room.",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  step: 2,
                  title: "Funds Secured",
                  description: "Cryptocurrency is automatically locked in our secure escrow wallet until trade completion.",
                  color: "from-green-500 to-green-600"
                },
                {
                  step: 3,
                  title: "Payment Verification",
                  description: "Both parties confirm payment completion with optional proof upload for verification.",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  step: 4,
                  title: "Automatic Release",
                  description: "Funds are automatically released to the buyer upon successful payment confirmation.",
                  color: "from-teal-500 to-teal-600"
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-white">{item.title}</h4>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Card className="crypto-card">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl mb-6 flex items-center text-white">
                  <Shield className="w-6 h-6 mr-3 text-green-400" />
                  Security Features
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Multi-sig Wallets",
                    "Dispute Resolution", 
                    "Identity Verification",
                    "Transaction Logs",
                    "24/7 Monitoring",
                    "Insurance Coverage"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="crypto-card">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Trusted by Traders Worldwide
                </h2>
                <p className="text-xl text-gray-300">
                  Join thousands of satisfied users who trust CryptoX for their trading needs
                </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-8 h-8 text-crypto-light mx-auto mb-4" />
                    <div className="text-4xl lg:text-5xl font-bold text-crypto-light mb-2">{stat.value}</div>
                    <div className="text-gray-300 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
          </div>
          
          <Card className="crypto-card">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-white mb-6 italic">
                  "{testimonials[currentSlide].content}"
                </blockquote>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-crypto-light rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentSlide].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonials[currentSlide].name}</div>
                    <div className="text-sm text-gray-400">{testimonials[currentSlide].role}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? "bg-crypto-light" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="crypto-card text-center">
            <CardContent className="p-12">
              <Zap className="w-16 h-16 text-crypto-light mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Start Trading?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join CryptoX today and experience the future of cryptocurrency trading with our premium platform.
              </p>
              <Button
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-crypto-blue to-crypto-teal hover:from-crypto-blue/80 hover:to-crypto-teal/80 text-white font-semibold px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl pulse-glow shimmer-effect animate-bounce-in"
              >
                Get Started Free
                <ArrowRightLeft className="w-6 h-6 ml-2 group-hover:rotate-180 transition-transform duration-500" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-crypto-blue to-crypto-teal rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  CryptoX
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                India's premier cryptocurrency trading platform with secure escrow services and seamless INR integration.
              </p>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <Send className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <Globe className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Trading */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Trading</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Crypto Exchange</a></li>
                <li><a href="#" className="hover:text-white transition-colors">P2P Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Escrow Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">INR Gateway</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Data</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trading Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 CryptoX. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>SSL Secured</span>
              </span>
              <span className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>KYC Compliant</span>
              </span>
              <span className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>Audited</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
