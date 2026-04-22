// MongoDB connection with serverless caching
import mongoose from "mongoose";

let cached = global.__mongooseCache;

if (!cached) {
  cached = global.__mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in environment variables");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    // reset cache so next request retries instead of reusing failed promise
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}
