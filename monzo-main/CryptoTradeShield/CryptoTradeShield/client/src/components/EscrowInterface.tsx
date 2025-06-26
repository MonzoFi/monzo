import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, University, ShoppingCart, Tag, User, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function EscrowInterface() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [cryptocurrency, setCryptocurrency] = useState("BTC");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [inrAmount, setInrAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [counterpartyEmail, setCounterpartyEmail] = useState("");
  const { toast } = useToast();

  // Create escrow mutation
  const createEscrowMutation = useMutation({
    mutationFn: async (escrowData: any) => {
      return await apiRequest("POST", "/api/escrow", escrowData);
    },
    onSuccess: () => {
      toast({
        title: "Escrow Trade Created",
        description: "Your secure trade room has been created successfully.",
      });
      // Reset form
      setCryptoAmount("");
      setInrAmount("");
      setCounterpartyEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create escrow trade.",
        variant: "destructive",
      });
    },
  });

  const handleCreateEscrow = () => {
    if (!cryptoAmount || !inrAmount || !counterpartyEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createEscrowMutation.mutate({
      type: tradeType,
      cryptocurrency,
      cryptoAmount,
      inrAmount,
      paymentMethod,
      counterpartyId: counterpartyEmail, // In production, this would be resolved to user ID
    });
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

  const estimatedInrValue = cryptoAmount ? (parseFloat(cryptoAmount) * 8421567).toLocaleString() : "0";

  return (
    <Card className="crypto-card glow-effect p-8">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center">
          <Shield className="w-6 h-6 mr-3 text-green-400" />
          Create Secure Escrow Trade
          <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-400">
            Protected
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trade Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Trade Type</Label>
          <RadioGroup
            value={tradeType}
            onValueChange={(value: "buy" | "sell") => setTradeType(value)}
            className="grid grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" className="border-crypto-light text-crypto-light" />
              <Label
                htmlFor="buy"
                className={`flex-1 p-4 rounded-xl text-center font-medium cursor-pointer transition-all ${
                  tradeType === "buy"
                    ? "bg-crypto-light/20 border-2 border-crypto-light text-white"
                    : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
                }`}
              >
                <ShoppingCart className="w-5 h-5 mx-auto mb-1" />
                I want to Buy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" className="border-crypto-light text-crypto-light" />
              <Label
                htmlFor="sell"
                className={`flex-1 p-4 rounded-xl text-center font-medium cursor-pointer transition-all ${
                  tradeType === "sell"
                    ? "bg-crypto-light/20 border-2 border-crypto-light text-white"
                    : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
                }`}
              >
                <Tag className="w-5 h-5 mx-auto mb-1" />
                I want to Sell
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Cryptocurrency</Label>
            <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
              <SelectTrigger className="premium-input p-4 text-white border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-white/20">
                {["BTC", "ETH", "SOL", "LTC", "BNB"].map((symbol) => (
                  <SelectItem key={symbol} value={symbol} className="text-white hover:bg-white/10">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCurrencyIcon(symbol)}</span>
                      <span className="font-semibold">{symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Fiat Currency</Label>
            <div className="premium-input p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">₹</span>
                <span className="font-semibold text-white">INR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Crypto Amount</Label>
            <div className="premium-input p-4">
              <Input
                type="number"
                placeholder="0.05"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                className="w-full bg-transparent text-xl font-semibold text-white border-none outline-none"
              />
              <div className="text-sm text-gray-400 mt-1">≈ ₹{estimatedInrValue}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">INR Amount</Label>
            <div className="premium-input p-4">
              <Input
                type="number"
                placeholder="421078"
                value={inrAmount}
                onChange={(e) => setInrAmount(e.target.value)}
                className="w-full bg-transparent text-xl font-semibold text-white border-none outline-none"
              />
              <div className="text-sm text-gray-400 mt-1">Fixed Rate</div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setPaymentMethod("upi")}
              className={`premium-input p-3 flex items-center space-x-3 cursor-pointer transition-all ${
                paymentMethod === "upi" ? "border-crypto-light bg-crypto-light/10" : "hover:bg-white/10"
              }`}
            >
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">UPI</span>
              {paymentMethod === "upi" && (
                <div className="ml-auto w-2 h-2 bg-crypto-light rounded-full" />
              )}
            </div>
            
            <div
              onClick={() => setPaymentMethod("bank_transfer")}
              className={`premium-input p-3 flex items-center space-x-3 cursor-pointer transition-all ${
                paymentMethod === "bank_transfer" ? "border-crypto-light bg-crypto-light/10" : "hover:bg-white/10"
              }`}
            >
              <University className="w-5 h-5 text-green-400" />
              <span className="font-medium text-white">Bank Transfer</span>
              {paymentMethod === "bank_transfer" && (
                <div className="ml-auto w-2 h-2 bg-crypto-light rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Counterparty */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Invite Counterparty</Label>
          <div className="premium-input p-4 flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="user@example.com or User ID"
              value={counterpartyEmail}
              onChange={(e) => setCounterpartyEmail(e.target.value)}
              className="flex-1 bg-transparent text-white border-none outline-none"
            />
          </div>
        </div>

        {/* Security Features Info */}
        <div className="glass-morphism rounded-xl p-4 border border-green-400/20">
          <div className="flex items-center text-sm font-medium text-green-400 mb-3">
            <Shield className="w-4 h-4 mr-2" />
            Security Features
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-white">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span>Multi-sig Escrow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span>Dispute Resolution</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span>Identity Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span>Transaction Logs</span>
            </div>
          </div>
        </div>

        {/* Create Trade Button */}
        <Button
          onClick={handleCreateEscrow}
          disabled={createEscrowMutation.isPending}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
        >
          {createEscrowMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Trade Room...</span>
            </div>
          ) : (
            <>
              Create Secure Trade
              <Shield className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
