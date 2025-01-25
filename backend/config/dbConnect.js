
import mongoose from "mongoose";
const dbConnect = async () => {
  try {
    console.log('MONGO_URL:', process.env.MONGO_URL);

    const connected = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connected ${connected.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnect;
