import mongoose from "mongoose";
export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB);
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error de conexión:", error);
        process.exit(1);
    }
};