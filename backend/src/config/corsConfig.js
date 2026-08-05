import cors from 'cors';

export const corsOptions = {
  origin: (origin, callback) => {
    // In development mode, allow localhost, local IP addresses (192.168.x.x, 10.x.x.x), and Vercel domains
    if (!origin || process.env.NODE_ENV !== 'production' || origin.includes('192.168.') || origin.includes('localhost') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

export default cors(corsOptions);
