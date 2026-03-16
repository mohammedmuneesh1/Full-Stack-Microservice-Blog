// ============= Controller with Pagination =============
export async function GET_ALL_BLOGS_CONTROLLERS(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { 
        searchQuery = "", 
        category = "",
        page = "1",
        limit = "10"
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Include pagination in cache key
    const cacheKey = `blogs:${searchQuery}:${category}:${pageNum}:${limitNum}`;
    
    const cached = await redisClientConfig.get(cacheKey);

    if (cached) {
        console.info(`Cache hit for key: ${cacheKey}`);
        return ResponseHandler(res, 200, true, JSON.parse(cached), 'Blogs fetched from cache');
    }

    // Build query dynamically
    let blogs;
    let countQuery;
    
    if (searchQuery && category) {
        blogs = await sql`
            SELECT * FROM blogs 
            WHERE (title ILIKE ${'%' + searchQuery + '%'} OR description ILIKE ${'%' + searchQuery + '%'})
            AND category ILIKE ${'%' + category + '%'}
            ORDER BY createdAt DESC 
            LIMIT ${limitNum} OFFSET ${offset}
        `;
        countQuery = await sql`
            SELECT COUNT(*) as total FROM blogs 
            WHERE (title ILIKE ${'%' + searchQuery + '%'} OR description ILIKE ${'%' + searchQuery + '%'})
            AND category ILIKE ${'%' + category + '%'}
        `;
    } else if (searchQuery) {
        blogs = await sql`
            SELECT * FROM blogs 
            WHERE title ILIKE ${'%' + searchQuery + '%'} OR description ILIKE ${'%' + searchQuery + '%'}
            ORDER BY createdAt DESC 
            LIMIT ${limitNum} OFFSET ${offset}
        `;
        countQuery = await sql`
            SELECT COUNT(*) as total FROM blogs 
            WHERE title ILIKE ${'%' + searchQuery + '%'} OR description ILIKE ${'%' + searchQuery + '%'}
        `;
    } else if (category) {
        blogs = await sql`
            SELECT * FROM blogs 
            WHERE category ILIKE ${'%' + category + '%'}
            ORDER BY createdAt DESC 
            LIMIT ${limitNum} OFFSET ${offset}
        `;
        countQuery = await sql`
            SELECT COUNT(*) as total FROM blogs 
            WHERE category ILIKE ${'%' + category + '%'}
        `;
    } else {
        blogs = await sql`
            SELECT * FROM blogs 
            ORDER BY createdAt DESC 
            LIMIT ${limitNum} OFFSET ${offset}
        `;
        countQuery = await sql`SELECT COUNT(*) as total FROM blogs`;
    }

    const totalBlogs = countQuery[0].total;
    const totalPages = Math.ceil(totalBlogs / limitNum);

    const response = {
        blogs,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalBlogs,
            limit: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    };

    // Cache with shorter TTL for search results
    const ttl = searchQuery || category ? 1800 : 3600; // 30 min for filtered, 1 hour for general
    await redisClientConfig.set(cacheKey, JSON.stringify(response), { EX: ttl });

    return ResponseHandler(res, 200, true, response, 'Blogs fetched successfully');
}

// ============= Improved Cache Consumer =============
interface CacheInvalidationMessage {
    action: string;
    keys: string[];
    blogId?: string; // Optional: for targeted invalidation
}

export const startCacheConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username: 'guest',
            password: 'guest',
        });

        const channel = await connection.createChannel();
        const queueName = 'cache-invalidation';
        
        await channel.assertQueue(queueName, { durable: true });
        console.log('✅ Blog Service RabbitMQ Cache consumer started');

        channel.consume(queueName, async (message) => {
            if (message) {
                try {
                    const content = JSON.parse(message.content.toString()) as CacheInvalidationMessage;
                    console.log('📩 Received cache invalidation:', content);

                    if (content.action === 'invalidateCache') {
                        let totalKeysDeleted = 0;

                        for (const pattern of content.keys) {
                            const keys = await redisClientConfig.keys(pattern);
                            
                            if (keys.length > 0) {
                                await redisClientConfig.del(keys);
                                totalKeysDeleted += keys.length;
                                console.log(`🗑️ Invalidated ${keys.length} keys matching: ${pattern}`);
                            }
                        }

                        console.log(`✅ Total cache entries invalidated: ${totalKeysDeleted}`);
                        
                        // Optional: Rebuild only the most commonly accessed cache (first page, no filters)
                        // This is a trade-off - you can choose to rebuild or let it be lazy-loaded
                        if (totalKeysDeleted > 0) {
                            await rebuildCommonCache();
                        }
                    }

                    channel.ack(message);
                } catch (error) {
                    console.error('❌ Failed to process cache invalidation:', 
                        error instanceof Error ? error.message : error);
                    channel.nack(message, false, true);
                }
            }
        });

    } catch (error) {
        console.error('❌ Blog consumer failed:', 
            error instanceof Error ? error.message : error);
    }
};

// Helper function to rebuild commonly accessed caches
async function rebuildCommonCache() {
    try {
        // Rebuild first page with no filters (most common request)
        const cacheKey = 'blogs:::1:10';
        const blogs = await sql`
            SELECT * FROM blogs 
            ORDER BY createdAt DESC 
            LIMIT 10
        `;
        const countQuery = await sql`SELECT COUNT(*) as total FROM blogs`;
        
        const response = {
            blogs,
            pagination: {
                currentPage: 1,
                totalPages: Math.ceil(countQuery[0].total / 10),
                totalBlogs: countQuery[0].total,
                limit: 10,
                hasNextPage: countQuery[0].total > 10,
                hasPrevPage: false
            }
        };

        await redisClientConfig.set(cacheKey, JSON.stringify(response), { EX: 3600 });
        console.log('🔄 Rebuilt common cache:', cacheKey);
    } catch (error) {
        console.error('❌ Failed to rebuild cache:', error);
    }
}

// ============= Alternative: Targeted Cache Invalidation =============
export async function invalidateSpecificBlogCache(blogId: string) {
    // When a blog is created/updated/deleted, only invalidate all blog list caches
    // Don't rebuild - let them be lazy-loaded on next request
    const pattern = 'blogs:*';
    const keys = await redisClientConfig.keys(pattern);
    
    if (keys.length > 0) {
        await redisClientConfig.del(keys);
        console.log(`🗑️ Invalidated ${keys.length} blog cache entries`);
    }
}



2:42 PM
Looking at your code, I can see some important issues that would make this not work well in a real-world scenario, especially with pagination:

Key Problems:
1. Cache Key Doesn't Include Pagination
Your cache key is:

typescript
const cacheKey = `blogs:${searchQuery}:${category}`;
But you're always doing LIMIT 10 with no offset/page parameter. In a real paginated system, you need:

typescript
const cacheKey = `blogs:${searchQuery}:${category}:${page}:${limit}`;
2. Cache Invalidation Rebuilds Only One Cache Entry
When you invalidate cache, you're only rebuilding:

typescript
const cacheKey = `blogs:::` // empty search and category
This means if someone searched for "javascript" or filtered by "tech" category, those cache entries are deleted but never rebuilt. The next user will have to wait for a slow DB query.

3. Inefficient Cache Invalidation Strategy
You're deleting ALL cache entries matching the pattern, then only rebuilding one. With pagination, you might have:

blogs:::1:10
blogs:::2:10
blogs:javascript::1:10
blogs::tech:1:10
All get deleted, but only one gets rebuilt.

Better Approach for Real-World:



Recommendations:
Option 1: Lazy Cache Loading (Recommended)

Delete all cache entries on blog create/update/delete
Don't rebuild immediately
Let the next request populate the cache
Pros: Simple, no wasted computation
Cons: First request after invalidation is slower

Option 2: Selective Rebuild

Only rebuild the most common query (first page, no filters)
Let other combinations be lazy-loaded
Pros: Balance between performance and complexity
Cons: Still some wasted work

Option 3: Cache-Aside Pattern with TTL

Set appropriate TTLs (30 min for search results, 1 hour for general lists)
Don't invalidate on every change
Accept slightly stale data
Pros: Simplest, most scalable
Cons: Data might be briefly outdated

For most real-world blog systems, Option 1 or 3 works best. Option 2 (your current approach) creates unnecessary load trying to predict what users will request next.