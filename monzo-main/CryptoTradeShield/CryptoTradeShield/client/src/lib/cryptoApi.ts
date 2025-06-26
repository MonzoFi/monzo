import { MarketRate, CryptoCurrency, SwapQuote } from "@/types/crypto";

export class CryptoApi {
  private baseUrl = "/api";

  async getCryptocurrencies(): Promise<CryptoCurrency[]> {
    const response = await fetch(`${this.baseUrl}/cryptocurrencies`);
    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrencies");
    }
    return response.json();
  }

  async getMarketRates(): Promise<MarketRate[]> {
    const response = await fetch(`${this.baseUrl}/market-rates`);
    if (!response.ok) {
      throw new Error("Failed to fetch market rates");
    }
    return response.json();
  }

  async getExchangeRate(from: string, to: string): Promise<{ rate: number }> {
    const response = await fetch(`${this.baseUrl}/exchange-rate/${from}/${to}`);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    return response.json();
  }

  async calculateSwapQuote(
    fromCurrency: string,
    toCurrency: string,
    amount: string
  ): Promise<SwapQuote> {
    try {
      const rateResponse = await this.getExchangeRate(fromCurrency, toCurrency);
      const rate = rateResponse.rate;
      
      const fromAmount = parseFloat(amount);
      const toAmount = fromAmount * rate;
      const platformFee = fromAmount * 0.005; // 0.5%
      const networkFee = this.getNetworkFee(toCurrency);
      const totalFee = platformFee + networkFee;
      
      return {
        fromCurrency,
        toCurrency,
        fromAmount: amount,
        toAmount: toAmount.toFixed(8),
        exchangeRate: rate.toString(),
        platformFee: platformFee.toFixed(8),
        networkFee: networkFee.toFixed(8),
        totalFee: totalFee.toFixed(8),
        priceImpact: "0.1", // Mock price impact
      };
    } catch (error) {
      console.error("Error calculating swap quote:", error);
      throw error;
    }
  }

  private getNetworkFee(currency: string): number {
    const networkFees: Record<string, number> = {
      BTC: 0.0001,
      ETH: 0.002,
      SOL: 0.0001,
      LTC: 0.001,
      BNB: 0.001,
    };
    
    return networkFees[currency] || 0.001;
  }

  // Mock data for development
  getMockCryptocurrencies(): CryptoCurrency[] {
    return [
      {
        id: 1,
        symbol: "BTC",
        name: "Bitcoin",
        networkName: "Bitcoin",
        decimals: 8,
        isActive: true,
        minSwapAmount: "0.001",
        maxSwapAmount: "10",
        tradingFee: "0.005",
        iconUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      },
      {
        id: 2,
        symbol: "ETH",
        name: "Ethereum",
        networkName: "Ethereum",
        decimals: 18,
        isActive: true,
        minSwapAmount: "0.01",
        maxSwapAmount: "100",
        tradingFee: "0.005",
        iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      },
      {
        id: 3,
        symbol: "SOL",
        name: "Solana",
        networkName: "Solana",
        decimals: 9,
        isActive: true,
        minSwapAmount: "0.1",
        maxSwapAmount: "1000",
        tradingFee: "0.005",
        iconUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
      },
      {
        id: 4,
        symbol: "USDT",
        name: "Tether",
        networkName: "Ethereum",
        decimals: 6,
        isActive: true,
        minSwapAmount: "10",
        maxSwapAmount: "10000",
        tradingFee: "0.001",
        iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      },
      {
        id: 5,
        symbol: "LTC",
        name: "Litecoin",
        networkName: "Litecoin",
        decimals: 8,
        isActive: true,
        minSwapAmount: "0.01",
        maxSwapAmount: "100",
        tradingFee: "0.004",
        iconUrl: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      },
      {
        id: 6,
        symbol: "BNB",
        name: "BNB",
        networkName: "BSC",
        decimals: 18,
        isActive: true,
        minSwapAmount: "0.1",
        maxSwapAmount: "500",
        tradingFee: "0.003",
        iconUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      },
      {
        id: 7,
        symbol: "ADA",
        name: "Cardano",
        networkName: "Cardano",
        decimals: 6,
        isActive: true,
        minSwapAmount: "10",
        maxSwapAmount: "5000",
        tradingFee: "0.002",
        iconUrl: "https://cryptologos.cc/logos/cardano-ada-logo.png",
      },
      {
        id: 8,
        symbol: "MATIC",
        name: "Polygon",
        networkName: "Polygon",
        decimals: 18,
        isActive: true,
        minSwapAmount: "1",
        maxSwapAmount: "2000",
        tradingFee: "0.002",
        iconUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      },
    ];
  }

  getMockMarketRates(): MarketRate[] {
    return [
      {
        id: 1,
        symbol: "BTC",
        priceUsd: "84215.67",
        priceInr: "7125678.50",
        change24h: "2.34",
        volume24h: "28500000000",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 2,
        symbol: "ETH",
        priceUsd: "1982.34",
        priceInr: "167542.85",
        change24h: "-1.12",
        volume24h: "12400000000",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 3,
        symbol: "SOL",
        priceUsd: "185.67",
        priceInr: "15634.23",
        change24h: "5.67",
        volume24h: "1200000000",
        lastUpdated: new Date().toISOString(),
      },
    ];
  }
}

export const cryptoApi = new CryptoApi();
