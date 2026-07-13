import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  const conn = await mongoose.connect(uri, {
    // Fail faster in CI/smoke so logs are clear; compose retries via restart policy
    serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS) || 10_000,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};
