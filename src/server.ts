import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express"
import mongoose from "mongoose"

import authRoutes from "./controllers/auth";
import productsRoutes from "./controllers/products";
import financeRoutes from "./controllers/finance";

import swaggerDocs from "./docs/swagger.json"

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get("/terms", (request, response) => {
  return response.json({
    message: "Termos de Serviços",
  });
});

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/finance", financeRoutes);

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.bubdf9o.mongodb.net/bancodaapi?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.log(err) )
