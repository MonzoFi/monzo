export class CryptoService {
  private readonly COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
  private readonly PLATFORM_FEE_RATE = 0.005; // 0.5%
  
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // For demo purposes, using mock rates. In production, use real API
      const response = await fetch(
        `${this.COINGECKO_API_BASE}/simple/price?ids=${this.getCoinGeckoId(fromCurrency)}&vs_currencies=${this.getCoinGeckoId(toCurrency)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      const data = await response.json();
      const fromId = this.getCoinGeckoId(fromCurrency);
      const toId = this.getCoinGeckoId(toCurrency);
      
      return data[fromId]?.[toId] || this.getMockRate(fromCurrency, toCurrency);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return this.getMockRate(fromCurrency, toCurrency);
    }
  }

  async getMarketPrices(): Promise<Record<string, number>> {
    try {
      const coins = ['bitcoin', 'ethereum', 'solana', 'litecoin', 'binancecoin'];
      const response = await fetch(
        `${this.COINGECKO_API_BASE}/simple/price?ids=${coins.join(',')}&vs_currencies=usd,inr&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch market prices');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return this.getMockMarketPrices();
    }
  }

  async calculatePlatformFee(amount: string): Promise<number> {
    const numericAmount = parseFloat(amount);
    return numericAmount * this.PLATFORM_FEE_RATE;
  }

  async calculateNetworkFee(currency: string): Promise<number> {
    // Mock network fees - in production, get from blockchain APIs
    const networkFees: Record<string, number> = {
      BTC: 0.0001,
      ETH: 0.002,
      SOL: 0.0001,
      LTC: 0.001,
      BNB: 0.001,
    };
    
    return networkFees[currency] || 0.001;
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      LTC: 'litecoin',
      BNB: 'binancecoin',
      USDT: 'tether',
    };
    
    return mapping[symbol] || symbol.toLowerCase();
  }

  private getMockRate(fromCurrency: string, toCurrency: string): number {
    // Mock exchange rates for development
    const rates: Record<string, Record<string, number>> = {
      BTC: { ETH: 42.3, SOL: 4500, LTC: 1200 },
      ETH: { BTC: 0.024, SOL: 106, LTC: 28 },
      SOL: { BTC: 0.00022, ETH: 0.0094, LTC: 0.26 },
    };
    
    return rates[fromCurrency]?.[toCurrency] || 1;
  }

  private getMockMarketPrices(): Record<string, number> {
    return {
      bitcoin: { usd: 84215, inr: 7125678, usd_24h_change: 2.34 },
      ethereum: { usd: 1982, inr: 167542, usd_24h_change: -1.12 },
      solana: { usd: 185, inr: 15634, usd_24h_change: 5.67 },
      litecoin: { usd: 123, inr: 10398, usd_24h_change: 1.23 },
      binancecoin: { usd: 645, inr: 54567, usd_24h_change: -0.89 },
    };
  }
}

export const cryptoService = new CryptoService();
