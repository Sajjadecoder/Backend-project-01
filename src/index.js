import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import { app } from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

(async () => {
    try {
        console.log("Connecting to DB at:", process.env.MONGODB_URL);
        
        const connectDB = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`Connected to database: ${connectDB.connection.host}`);

        // Start server only after successful DB connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Connection failed", error);
        process.exit(1); // Exit process with failure
    }
})();
