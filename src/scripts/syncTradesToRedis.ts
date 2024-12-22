import { AppDataSource } from '../data-source';
import { Trade } from '../entities/Trade';
import redis from '../redis';

const syncTradesToRedis = async () => {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log('Database connected.');

    const tradeRepository = AppDataSource.getRepository(Trade);

    // Fetch all trades from the database
    const trades = await tradeRepository.find();
    console.log(`Found ${trades.length} trades in PostgreSQL.`);

    for (const trade of trades) {
      // Store full trade data under trade:<trade_id>
      const tradeKey = `trade:${trade.id}`;
      await redis.set(tradeKey, JSON.stringify(trade));
      
      const score = trade.id

      // Add trade ID to sorted sets with the score
      await redis.zadd('trades:all', score, trade.id.toString());
      await redis.zadd(`trades:user:${trade.user_id}`, score, trade.id.toString());
      await redis.zadd(`trades:type:${trade.type}`, score, trade.id.toString());
      await redis.zadd(`trades:user:${trade.user_id}:type:${trade.type}`, score, trade.id.toString());
    }

    console.log('Trades successfully synced to Redis.');
  } catch (error) {
    console.error('Error syncing trades to Redis:', error);
  } finally {
    // Close the database connection
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
};

// Run the sync function
syncTradesToRedis();
