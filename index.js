const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Load schema & resolvers
const typeDefs = require("./schema/schema");
const resolvers = require("./resolver/resolver");

// Load db methods
const mongoDataMethods = require("./data/db");

// Connect to MongoDB
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ mongoDataMethods }),
});

const app = express();
app.use(cors());
server.start().then((res) => {
  server.applyMiddleware({ app });
  app.listen({ port: 3000 }, () => console.log("http://localhost:8080"));
});
