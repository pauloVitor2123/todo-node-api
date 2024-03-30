import mongoose from "mongoose";

const startDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "todo-database",
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};

export default startDatabase;
