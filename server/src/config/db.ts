import mongoose from "mongoose";

// Variabel untuk menyimpan status koneksi (Cache)
let isConnected = false;

const connectDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Menggunakan koneksi MongoDB yang sudah ada.");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string, {
            serverSelectionTimeoutMS: 5000, // Jangan menunggu terlalu lama
        });

        isConnected = !!db.connections[0].readyState;
        console.log(`MongoDB successfully connected: ${db.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            // Lempar error agar ditangkap oleh router, jangan matikan proses
            throw new Error(error.message);
        }
    }
}

export default connectDB;