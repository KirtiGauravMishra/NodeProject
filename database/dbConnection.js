import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nodedb"; // Ensure you specify the dbName here
export const dbConnection = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "nodedb", 
    });
    console.log("Connected to database.");
  } catch (err) {
    console.error(`Error connecting to database: ${err.message}`);
    process.exit(1); 
  }
};
