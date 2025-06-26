export interface CryptoCurrency {
  id: number;
  symbol: string;
  name: string;
  networkName?: string;
  contractAddress?: string;
  decimals: number;
  isActive: boolean;
  minSwapAmount?: string;
  maxSwapAmount?: string;
  tradingFee: string;
  iconUrl?: string;
}

export interface MarketRate {
  id: number;
  symbol: string;
  priceUsd: string;
  priceInr: string;
  change24h: string;
  volume24h: string;
  lastUpdated: string;
}

export interface SwapQuote {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  platformFee: string;
  networkFee: string;
  totalFee: string;
  priceImpact: string;
}

export interface SwapTransaction {
  id: number;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  platformFee: string;
  networkFee: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fromAddress?: string;
  toAddress: string;
  transactionHash?: string;
  refundAddress?: string;
  expiresAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface EscrowTrade {
  id: number;
  creatorId: string;
  counterpartyId?: string;
  type: 'buy' | 'sell';
  cryptocurrency: string;
  cryptoAmount: string;
  inrAmount: string;
  paymentMethod: string;
  status: 'created' | 'accepted' | 'funded' | 'paid' | 'dispute' | 'completed' | 'cancelled';
  escrowAddress?: string;
  creatorConfirmed: boolean;
  counterpartyConfirmed: boolean;
  paymentProof?: string;
  disputeReason?: string;
  moderatorId?: string;
  moderatorNotes?: string;
  expiresAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: number;
  userId: string;
  type: 'upi' | 'bank_transfer' | 'imps' | 'card';
  details: {
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    bankName?: string;
    cardNumber?: string;
    cardHolderName?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}
