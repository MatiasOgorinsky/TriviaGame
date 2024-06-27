import mongoose from "mongoose";

interface CachedConnection {
    isConnected?: number;
    db?: typeof mongoose;
}

const connection: CachedConnection = {};

async function dbConnect() {
    if (connection.isConnected) {
        return connection.db;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL!);
        connection.isConnected = db.connections[0].readyState;
        connection.db = db;
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Unable to connect to MongoDB");
    }
}

export default dbConnect;
