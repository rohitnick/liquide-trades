import redis from "../redis";

export const fetchTradesFromRedis = async (type?: string, user_id?: number) => {
    let key = 'trades:all';
    
    if (user_id && type) key = `trades:user:${user_id}:type:${type}`;
    else if (user_id) key = `trades:user:${user_id}`;
    else if (type) key = `trades:type:${type}`;

    const tradeIds = await redis.zrange(key, 0, -1);

    // when no tradsIds are present - early return
    if (!tradeIds || tradeIds.length === 0) { return []; }
  
    // use mget for batching
    const tradeKeys = tradeIds.map((id) => `trade:${id}`);
    const tradeData = await redis.mget(tradeKeys);

    const trades = tradeData
    .filter((trade) => trade !== null)
    .map((trade) => JSON.parse(trade));

    return trades
};
