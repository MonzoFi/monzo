import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  kycStatus: varchar("kyc_status").default("pending"), // pending, verified, rejected
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  referralCode: varchar("referral_code").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Supported cryptocurrencies
export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").notNull().unique(), // BTC, ETH, etc.
  name: varchar("name").notNull(), // Bitcoin, Ethereum
  networkName: varchar("network_name"), // Bitcoin, Ethereum, Binance Smart Chain
  contractAddress: varchar("contract_address"), // For tokens
  decimals: integer("decimals").default(18),
  isActive: boolean("is_active").default(true),
  minSwapAmount: decimal("min_swap_amount", { precision: 20, scale: 8 }),
  maxSwapAmount: decimal("max_swap_amount", { precision: 20, scale: 8 }),
  tradingFee: decimal("trading_fee", { precision: 5, scale: 4 }).default("0.005"), // 0.5%
  iconUrl: varchar("icon_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Swap transactions
export const swapTransactions = pgTable("swap_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  fromCurrency: varchar("from_currency").references(() => cryptocurrencies.symbol),
  toCurrency: varchar("to_currency").references(() => cryptocurrencies.symbol),
  fromAmount: decimal("from_amount", { precision: 20, scale: 8 }).notNull(),
  toAmount: decimal("to_amount", { precision: 20, scale: 8 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 20, scale: 8 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 20, scale: 8 }).default("0"),
  networkFee: decimal("network_fee", { precision: 20, scale: 8 }).default("0"),
  status: varchar("status").default("pending"), // pending, processing, completed, failed
  fromAddress: varchar("from_address"),
  toAddress: varchar("to_address").notNull(),
  transactionHash: varchar("transaction_hash"),
  refundAddress: varchar("refund_address"),
  expiresAt: timestamp("expires_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// INR payment methods
export const inrPaymentMethods = pgTable("inr_payment_methods", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // upi, bank_transfer, imps, card
  details: jsonb("details").notNull(), // UPI ID, bank details, etc.
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// INR transactions
export const inrTransactions = pgTable("inr_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  paymentMethodId: integer("payment_method_id").references(() => inrPaymentMethods.id),
  type: varchar("type").notNull(), // buy, sell
  cryptocurrency: varchar("cryptocurrency").references(() => cryptocurrencies.symbol),
  cryptoAmount: decimal("crypto_amount", { precision: 20, scale: 8 }).notNull(),
  inrAmount: decimal("inr_amount", { precision: 12, scale: 2 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 12, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status").default("pending"), // pending, paid, confirmed, completed, failed
  paymentProof: varchar("payment_proof"), // URL to uploaded proof
  cryptoAddress: varchar("crypto_address"),
  transactionHash: varchar("transaction_hash"),
  expiresAt: timestamp("expires_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Escrow trades
export const escrowTrades = pgTable("escrow_trades", {
  id: serial("id").primaryKey(),
  creatorId: varchar("creator_id").references(() => users.id),
  counterpartyId: varchar("counterparty_id").references(() => users.id),
  type: varchar("type").notNull(), // buy, sell
  cryptocurrency: varchar("cryptocurrency").references(() => cryptocurrencies.symbol),
  cryptoAmount: decimal("crypto_amount", { precision: 20, scale: 8 }).notNull(),
  inrAmount: decimal("inr_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method").notNull(), // upi, bank_transfer, imps
  status: varchar("status").default("created"), // created, accepted, funded, paid, dispute, completed, cancelled
  escrowAddress: varchar("escrow_address"), // Multi-sig wallet address
  creatorConfirmed: boolean("creator_confirmed").default(false),
  counterpartyConfirmed: boolean("counterparty_confirmed").default(false),
  paymentProof: varchar("payment_proof"),
  disputeReason: text("dispute_reason"),
  moderatorId: varchar("moderator_id").references(() => users.id),
  moderatorNotes: text("moderator_notes"),
  expiresAt: timestamp("expires_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Escrow messages
export const escrowMessages = pgTable("escrow_messages", {
  id: serial("id").primaryKey(),
  tradeId: integer("trade_id").references(() => escrowTrades.id),
  senderId: varchar("sender_id").references(() => users.id),
  message: text("message").notNull(),
  attachmentUrl: varchar("attachment_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User wallets
export const userWallets = pgTable("user_wallets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  cryptocurrency: varchar("cryptocurrency").references(() => cryptocurrencies.symbol),
  address: varchar("address").notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Market rates cache
export const marketRates = pgTable("market_rates", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").notNull(),
  priceUsd: decimal("price_usd", { precision: 20, scale: 8 }).notNull(),
  priceInr: decimal("price_inr", { precision: 12, scale: 2 }).notNull(),
  change24h: decimal("change_24h", { precision: 5, scale: 2 }).default("0"),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }).default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Schema exports for forms
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertSwapTransactionSchema = createInsertSchema(swapTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertEscrowTradeSchema = createInsertSchema(escrowTrades).omit({
  id: true,
  createdAt: true,
});

export const insertInrTransactionSchema = createInsertSchema(inrTransactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;
export type SwapTransaction = typeof swapTransactions.$inferSelect;
export type InsertSwapTransaction = z.infer<typeof insertSwapTransactionSchema>;
export type EscrowTrade = typeof escrowTrades.$inferSelect;
export type InsertEscrowTrade = z.infer<typeof insertEscrowTradeSchema>;
export type InrTransaction = typeof inrTransactions.$inferSelect;
export type InsertInrTransaction = z.infer<typeof insertInrTransactionSchema>;
export type InrPaymentMethod = typeof inrPaymentMethods.$inferSelect;
export type UserWallet = typeof userWallets.$inferSelect;
export type MarketRate = typeof marketRates.$inferSelect;
export type EscrowMessage = typeof escrowMessages.$inferSelect;
