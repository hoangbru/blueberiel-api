import mongoose from "mongoose";

export const connectDB = () => {
  const dbName = process.env.DB_NAME;
  const mongoAtlasUri = process.env.MONGO_URI;
  if (!mongoAtlasUri) {
    console.error("❌ MONGO_URI is not set in the .env file");
    process.exit(1);
  }
  mongoose
    .connect(mongoAtlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`✅ Successfully connected to ${dbName || "the database"}`);
    })
    .catch((error) => {
      console.error("❌ Failed to connect:", error);
      process.exit(1); // Exit the process if connection fails
    });

  const dbConnection = mongoose.connection;
  dbConnection.on("error", (err) =>
    console.error(`❌ Connection error: ${err}`)
  );
  dbConnection.once("open", () =>
    console.log(`📂 Database ${dbName || "default"} is ready!`)
  );
};
