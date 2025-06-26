import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Coins, ArrowRightLeft, Shield, TrendingUp, Settings, LogOut, User } from "lucide-react";
import monzoLogo from "@assets/monzo_1750959119738.jpg";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const navItems = [
    {
      href: "/",
      label: "Exchange",
      icon: ArrowRightLeft,
      active: location === "/",
    },
    {
      href: "/escrow",
      label: "Escrow",
      icon: Shield,
      active: location === "/escrow",
    },
    {
      href: "/trading",
      label: "Trading",
      icon: TrendingUp,
      active: location === "/trading",
    },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={monzoLogo} 
              alt="Monzo Logo" 
              className="w-10 h-10 rounded-xl shadow-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent">
              Monzo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated &&
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-crypto-light ${
                    item.active ? "text-crypto-light" : "text-white/80"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || ""} />
                      <AvatarFallback className="bg-crypto-light text-white">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-morphism border-white/10" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.firstName && (
                        <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                      )}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-white/70">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/10" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
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
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden text-white hover:bg-white/10" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-morphism border-white/10 text-white">
                <div className="flex flex-col space-y-4 mt-8">
                  {isAuthenticated &&
                    navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 text-lg font-medium transition-colors hover:text-crypto-light ${
                          item.active ? "text-crypto-light" : "text-white"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  
                  {!isAuthenticated && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={handleLogin}
                        className="justify-start text-white hover:text-crypto-light hover:bg-white/10"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={handleLogin}
                        className="bg-gradient-to-r from-crypto-blue to-crypto-teal text-white"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
