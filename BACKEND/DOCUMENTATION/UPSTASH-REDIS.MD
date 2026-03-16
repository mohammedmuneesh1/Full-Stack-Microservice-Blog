  
  // get 
  const cached = await redisClientConfig.get(cacheKey);
 //  set
  await redisClientConfig.set(cacheKey,JSON.stringify(blogs),{EX:3600});

  
