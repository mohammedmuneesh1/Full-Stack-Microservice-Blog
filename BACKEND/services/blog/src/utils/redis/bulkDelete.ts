import { redisClientConfig } from "../../config/redisConnect.js";

// Delete all keys starting with "blogs::"
async function deleteBlogCache() {
  let cursor = '0';
  let deletedCount = 0;
  do {
    // Scan for keys matching the pattern
    const result = await redisClientConfig.scan(cursor, {
      MATCH: 'blogs::*',
      COUNT: 100,
   // COUNT: 100 is a HINT to Redis saying: "Hey, try to return around 100 keys per iteration"
    });
 // COUNT: 100 does NOT mean "return 100 keys"
// It means: "Redis, scan approximately 100 hash slots"
//Redis stores keys in hash slots (internal buckets)
//Each hash slot can contain 0, 1, 5, or 10+ keys


    
    cursor = result.cursor;
    const keys = result.keys;
    
    // Delete the keys found in this iteration
    if (keys.length > 0) {
      await redisClientConfig.del(keys);
      deletedCount += keys.length;
    }
  } while (cursor !== '0');
  console.log(`Deleted ${deletedCount} keys`);
}

// cursor = '0' happens when Redis finishes scanning its entire database
// COUNT: 100 = scan ~100 internal slots, NOT return 100 keys
// Keys returned depends on how many matching keys exist in those slots (could be 10, 50, 200...)


// Iteration 1: 30 keys, cursor = '111'
// Iteration 2: 45 keys, cursor = '222'
// Iteration 3: 25 keys, cursor = '0' (done)

// Total: Loop ran 3 times, deleted 100 keys


// cursor = '0'     // START: "I'm at the beginning"
// cursor = '111'   // "I scanned some, but there's more to scan"
// cursor = '222'   // "Still more to scan..."
// cursor = '0'     // END: "I've scanned everything, we're done!"


// COUNT: 100 does NOT mean "return 100 keys"
// It means: "Redis, scan approximately 100 hash slots"



// COUNT: 100  // "Check ~100 hash slots"

// // Iteration 1: Redis scans 100 slots
// // - Slot 1: has 0 matching keys
// // - Slot 2: has 1 matching key "blogs::home"
// // - Slot 3: has 2 matching keys
// // - ...
// // Total: Found 30 matching keys from those 100 slots
// result.keys = [30 keys]
// cursor = '111'  // Still more slots to scan

// // Iteration 2: Redis scans another ~100 slots
// // Found 45 matching keys
// cursor = '222'

// // Iteration 3: Redis scans remaining slots
// // Found 25 matching keys
// cursor = '0'  // Done! No more slots to scan