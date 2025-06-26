import {
  users,
  cryptocurrencies,
  swapTransactions,
  inrTransactions,
  escrowTrades,
  escrowMessages,
  userWallets,
  marketRates,
  inrPaymentMethods,
  type User,
  type UpsertUser,
  type Cryptocurrency,
  type SwapTransaction,
  type InsertSwapTransaction,
  type EscrowTrade,
  type InsertEscrowTrade,
  type InrTransaction,
  type InsertInrTransaction,
  type InrPaymentMethod,
  type UserWallet,
  type MarketRate,
  type EscrowMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Cryptocurrency operations
  getCryptocurrencies(): Promise<Cryptocurrency[]>;
  getActiveCryptocurrencies(): Promise<Cryptocurrency[]>;
  getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined>;
  
  // Swap operations
  createSwapTransaction(swap: InsertSwapTransaction): Promise<SwapTransaction>;
  getSwapTransaction(id: number): Promise<SwapTransaction | undefined>;
  getUserSwapTransactions(userId: string): Promise<SwapTransaction[]>;
  updateSwapTransactionStatus(id: number, status: string): Promise<void>;
  
  // INR operations
  createInrTransaction(transaction: InsertInrTransaction): Promise<InrTransaction>;
  getInrTransaction(id: number): Promise<InrTransaction | undefined>;
  getUserInrTransactions(userId: string): Promise<InrTransaction[]>;
  updateInrTransactionStatus(id: number, status: string): Promise<void>;
  
  // Escrow operations
  createEscrowTrade(trade: InsertEscrowTrade): Promise<EscrowTrade>;
  getEscrowTrade(id: number): Promise<EscrowTrade | undefined>;
  getUserEscrowTrades(userId: string): Promise<EscrowTrade[]>;
  updateEscrowTradeStatus(id: number, status: string): Promise<void>;
  addEscrowMessage(tradeId: number, senderId: string, message: string): Promise<EscrowMessage>;
  getEscrowMessages(tradeId: number): Promise<EscrowMessage[]>;
  
  // Market data operations
  getMarketRates(): Promise<MarketRate[]>;
  updateMarketRate(symbol: string, priceUsd: number, priceInr: number, change24h: number): Promise<void>;
  
  // Wallet operations
  getUserWallets(userId: string): Promise<UserWallet[]>;
  getUserWallet(userId: string, cryptocurrency: string): Promise<UserWallet | undefined>;
  updateWalletBalance(userId: string, cryptocurrency: string, balance: number): Promise<void>;
  
  // Payment methods
  getUserPaymentMethods(userId: string): Promise<InrPaymentMethod[]>;
  createPaymentMethod(userId: string, type: string, details: any): Promise<InrPaymentMethod>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Cryptocurrency operations
  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    return await db.select().from(cryptocurrencies).orderBy(cryptocurrencies.name);
  }

  async getActiveCryptocurrencies(): Promise<Cryptocurrency[]> {
    return await db
      .select()
      .from(cryptocurrencies)
      .where(eq(cryptocurrencies.isActive, true))
      .orderBy(cryptocurrencies.name);
  }

  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db
      .select()
      .from(cryptocurrencies)
      .where(eq(cryptocurrencies.symbol, symbol));
    return crypto;
  }

  // Swap operations
  async createSwapTransaction(swap: InsertSwapTransaction): Promise<SwapTransaction> {
    const [transaction] = await db
      .insert(swapTransactions)
      .values(swap)
      .returning();
    return transaction;
  }

  async getSwapTransaction(id: number): Promise<SwapTransaction | undefined> {
    const [transaction] = await db
      .select()
      .from(swapTransactions)
      .where(eq(swapTransactions.id, id));
    return transaction;
  }

  async getUserSwapTransactions(userId: string): Promise<SwapTransaction[]> {
    return await db
      .select()
      .from(swapTransactions)
      .where(eq(swapTransactions.userId, userId))
      .orderBy(desc(swapTransactions.createdAt));
  }

  async updateSwapTransactionStatus(id: number, status: string): Promise<void> {
    await db
      .update(swapTransactions)
      .set({ status, ...(status === "completed" && { completedAt: new Date() }) })
      .where(eq(swapTransactions.id, id));
  }

  // INR operations
  async createInrTransaction(transaction: InsertInrTransaction): Promise<InrTransaction> {
    const [inrTransaction] = await db
      .insert(inrTransactions)
      .values(transaction)
      .returning();
    return inrTransaction;
  }

  async getInrTransaction(id: number): Promise<InrTransaction | undefined> {
    const [transaction] = await db
      .select()
      .from(inrTransactions)
      .where(eq(inrTransactions.id, id));
    return transaction;
  }

  async getUserInrTransactions(userId: string): Promise<InrTransaction[]> {
    return await db
      .select()
      .from(inrTransactions)
      .where(eq(inrTransactions.userId, userId))
      .orderBy(desc(inrTransactions.createdAt));
  }

  async updateInrTransactionStatus(id: number, status: string): Promise<void> {
    await db
      .update(inrTransactions)
      .set({ status, ...(status === "completed" && { completedAt: new Date() }) })
      .where(eq(inrTransactions.id, id));
  }

  // Escrow operations
  async createEscrowTrade(trade: InsertEscrowTrade): Promise<EscrowTrade> {
    const [escrowTrade] = await db
      .insert(escrowTrades)
      .values(trade)
      .returning();
    return escrowTrade;
  }

  async getEscrowTrade(id: number): Promise<EscrowTrade | undefined> {
    const [trade] = await db
      .select()
      .from(escrowTrades)
      .where(eq(escrowTrades.id, id));
    return trade;
  }

  async getUserEscrowTrades(userId: string): Promise<EscrowTrade[]> {
    return await db
      .select()
      .from(escrowTrades)
      .where(or(eq(escrowTrades.creatorId, userId), eq(escrowTrades.counterpartyId, userId)))
      .orderBy(desc(escrowTrades.createdAt));
  }

  async updateEscrowTradeStatus(id: number, status: string): Promise<void> {
    await db
      .update(escrowTrades)
      .set({ status, ...(status === "completed" && { completedAt: new Date() }) })
      .where(eq(escrowTrades.id, id));
  }

  async addEscrowMessage(tradeId: number, senderId: string, message: string): Promise<EscrowMessage> {
    const [escrowMessage] = await db
      .insert(escrowMessages)
      .values({ tradeId, senderId, message })
      .returning();
    return escrowMessage;
  }

  async getEscrowMessages(tradeId: number): Promise<EscrowMessage[]> {
    return await db
      .select()
      .from(escrowMessages)
      .where(eq(escrowMessages.tradeId, tradeId))
      .orderBy(escrowMessages.createdAt);
  }

  // Market data operations
  async getMarketRates(): Promise<MarketRate[]> {
    return await db
      .select()
      .from(marketRates)
      .orderBy(desc(marketRates.lastUpdated));
  }

  async updateMarketRate(symbol: string, priceUsd: number, priceInr: number, change24h: number): Promise<void> {
    await db
      .insert(marketRates)
      .values({
        symbol,
        priceUsd: priceUsd.toString(),
        priceInr: priceInr.toString(),
        change24h: change24h.toString(),
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: marketRates.symbol,
        set: {
          priceUsd: priceUsd.toString(),
          priceInr: priceInr.toString(),
          change24h: change24h.toString(),
          lastUpdated: new Date(),
        },
      });
  }

  // Wallet operations
  async getUserWallets(userId: string): Promise<UserWallet[]> {
    return await db
      .select()
      .from(userWallets)
      .where(and(eq(userWallets.userId, userId), eq(userWallets.isActive, true)));
  }

  async getUserWallet(userId: string, cryptocurrency: string): Promise<UserWallet | undefined> {
    const [wallet] = await db
      .select()
      .from(userWallets)
      .where(
        and(
          eq(userWallets.userId, userId),
          eq(userWallets.cryptocurrency, cryptocurrency),
          eq(userWallets.isActive, true)
        )
      );
    return wallet;
  }

  async updateWalletBalance(userId: string, cryptocurrency: string, balance: number): Promise<void> {
    await db
      .update(userWallets)
      .set({ balance: balance.toString() })
      .where(
        and(
          eq(userWallets.userId, userId),
          eq(userWallets.cryptocurrency, cryptocurrency)
        )
      );
  }

  // Payment methods
  async getUserPaymentMethods(userId: string): Promise<InrPaymentMethod[]> {
    return await db
      .select()
      .from(inrPaymentMethods)
      .where(and(eq(inrPaymentMethods.userId, userId), eq(inrPaymentMethods.isActive, true)));
  }

  async createPaymentMethod(userId: string, type: string, details: any): Promise<InrPaymentMethod> {
    const [paymentMethod] = await db
      .insert(inrPaymentMethods)
      .values({ userId, type, details })
      .returning();
    return paymentMethod;
  }
}

export const storage = new DatabaseStorage();
