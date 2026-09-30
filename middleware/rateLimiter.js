// middleware/rateLimiter.js

// store requests information in memory
const requests = new Map();

const rateLimiter = (req, res, next) => {
    const ip = req.ip;      
    const now = Date.now();

    // one minute window
    const windowTime = 60 * 1000; 
    
    // maximum requests allowed per window
    const maxRequests = 50;

    // get previous request info for this IP
    const client = requests.get(ip);

    //first request from this IP
    if (!client) {
        requests.set(ip, { 
            count: 1, 
            startTime: now 
        });
        return next();
    }
    
    // Reset count after window time has passed
    if (now - client.startTime > windowTime) {
        requests.set(ip, {
            count: 1,
            startTime: now
        });
        return next();
    }

    // Reject request if max requests exceeded
    if (client.count >= maxRequests) {
        return res.status(429).json({
            error: 'Too Many Requests',
            message: `Maximum of 50 requests per minute exceeded. Please try again later.`
        });
    }

    // Increment request count
    client.count += 1;

    next();
};

module.exports = rateLimiter;   