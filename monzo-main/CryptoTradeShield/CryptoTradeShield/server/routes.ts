import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { cryptoService } from "./services/cryptoService";
import { escrowService } from "./services/escrowService";
import { z } from "zod";
import { insertSwapTransactionSchema, insertEscrowTradeSchema, insertInrTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Cryptocurrency routes
  app.get('/api/cryptocurrencies', async (req, res) => {
    try {
      const cryptocurrencies = await storage.getActiveCryptocurrencies();
      res.json(cryptocurrencies);
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
      res.status(500).json({ message: "Failed to fetch cryptocurrencies" });
    }
  });

  // Market data routes
  app.get('/api/market-rates', async (req, res) => {
    try {
      const rates = await storage.getMarketRates();
      res.json(rates);
    } catch (error) {
      console.error("Error fetching market rates:", error);
      res.status(500).json({ message: "Failed to fetch market rates" });
    }
  });

  app.get('/api/exchange-rate/:from/:to', async (req, res) => {
    try {
      const { from, to } = req.params;
      const rate = await cryptoService.getExchangeRate(from, to);
      res.json({ rate });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });

  // Swap transaction routes
  app.post('/api/swap', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const swapData = insertSwapTransactionSchema.parse({ ...req.body, userId });
      
      // Calculate exchange rate and fees
      const exchangeRate = await cryptoService.getExchangeRate(swapData.fromCurrency!, swapData.toCurrency!);
      const platformFee = await cryptoService.calculatePlatformFee(swapData.fromAmount!);
      const networkFee = await cryptoService.calculateNetworkFee(swapData.toCurrency!);
      
      const transaction = await storage.createSwapTransaction({
        ...swapData,
        exchangeRate: exchangeRate.toString(),
        platformFee: platformFee.toString(),
        networkFee: networkFee.toString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      });

      res.json(transaction);
    } catch (error) {
      console.error("Error creating swap transaction:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid swap data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create swap transaction" });
      }
    }
  });

  app.get('/api/swap/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionId = parseInt(req.params.id);
      const transaction = await storage.getSwapTransaction(transactionId);
      
      if (!transaction || transaction.userId !== userId) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching swap transaction:", error);
      res.status(500).json({ message: "Failed to fetch swap transaction" });
    }
  });

  app.get('/api/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserSwapTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching swap transactions:", error);
      res.status(500).json({ message: "Failed to fetch swap transactions" });
    }
  });

  // INR transaction routes
  app.post('/api/inr-transaction', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertInrTransactionSchema.parse({ ...req.body, userId });
      
      const transaction = await storage.createInrTransaction({
        ...transactionData,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      res.json(transaction);
    } catch (error) {
      console.error("Error creating INR transaction:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create INR transaction" });
      }
    }
  });

  app.get('/api/inr-transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserInrTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching INR transactions:", error);
      res.status(500).json({ message: "Failed to fetch INR transactions" });
    }
  });

  // Escrow routes
  app.post('/api/escrow', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const escrowData = insertEscrowTradeSchema.parse({ ...req.body, creatorId: userId });
      
      const trade = await storage.createEscrowTrade({
        ...escrowData,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Generate escrow address
      const escrowAddress = await escrowService.createEscrowWallet(trade.id);
      await storage.updateEscrowTradeStatus(trade.id, 'created');

      res.json({ ...trade, escrowAddress });
    } catch (error) {
      console.error("Error creating escrow trade:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid escrow data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create escrow trade" });
      }
    }
  });

  app.get('/api/escrow/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tradeId = parseInt(req.params.id);
      const trade = await storage.getEscrowTrade(tradeId);
      
      if (!trade || (trade.creatorId !== userId && trade.counterpartyId !== userId)) {
        return res.status(404).json({ message: "Escrow trade not found" });
      }
      
      res.json(trade);
    } catch (error) {
      console.error("Error fetching escrow trade:", error);
      res.status(500).json({ message: "Failed to fetch escrow trade" });
    }
  });

  app.get('/api/escrows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const trades = await storage.getUserEscrowTrades(userId);
      res.json(trades);
    } catch (error) {
      console.error("Error fetching escrow trades:", error);
      res.status(500).json({ message: "Failed to fetch escrow trades" });
    }
  });

  app.post('/api/escrow/:id/accept', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tradeId = parseInt(req.params.id);
      const trade = await storage.getEscrowTrade(tradeId);
      
      if (!trade || trade.counterpartyId !== userId) {
        return res.status(404).json({ message: "Escrow trade not found" });
      }
      
      await storage.updateEscrowTradeStatus(tradeId, 'accepted');
      res.json({ message: "Escrow trade accepted" });
    } catch (error) {
      console.error("Error accepting escrow trade:", error);
      res.status(500).json({ message: "Failed to accept escrow trade" });
    }
  });

  app.post('/api/escrow/:id/confirm-payment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tradeId = parseInt(req.params.id);
      const { paymentProof } = req.body;
      
      const trade = await storage.getEscrowTrade(tradeId);
      
      if (!trade || (trade.creatorId !== userId && trade.counterpartyId !== userId)) {
        return res.status(404).json({ message: "Escrow trade not found" });
      }
      
      // Update payment confirmation logic here
      await escrowService.confirmPayment(tradeId, userId, paymentProof);
      
      res.json({ message: "Payment confirmed" });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  app.get('/api/escrow/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tradeId = parseInt(req.params.id);
      const trade = await storage.getEscrowTrade(tradeId);
      
      if (!trade || (trade.creatorId !== userId && trade.counterpartyId !== userId)) {
        return res.status(404).json({ message: "Escrow trade not found" });
      }
      
      const messages = await storage.getEscrowMessages(tradeId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching escrow messages:", error);
      res.status(500).json({ message: "Failed to fetch escrow messages" });
    }
  });

  app.post('/api/escrow/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tradeId = parseInt(req.params.id);
      const { message } = req.body;
      
      const trade = await storage.getEscrowTrade(tradeId);
      
      if (!trade || (trade.creatorId !== userId && trade.counterpartyId !== userId)) {
        return res.status(404).json({ message: "Escrow trade not found" });
      }
      
      const escrowMessage = await storage.addEscrowMessage(tradeId, userId, message);
      res.json(escrowMessage);
    } catch (error) {
      console.error("Error adding escrow message:", error);
      res.status(500).json({ message: "Failed to add escrow message" });
    }
  });

  // Payment methods routes
  app.get('/api/payment-methods', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentMethods = await storage.getUserPaymentMethods(userId);
      res.json(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  app.post('/api/payment-methods', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type, details } = req.body;
      
      const paymentMethod = await storage.createPaymentMethod(userId, type, details);
      res.json(paymentMethod);
    } catch (error) {
      console.error("Error creating payment method:", error);
      res.status(500).json({ message: "Failed to create payment method" });
    }
  });

  // Wallet routes
  app.get('/api/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wallets = await storage.getUserWallets(userId);
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
