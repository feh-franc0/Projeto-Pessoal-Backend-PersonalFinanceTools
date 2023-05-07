import express from "express";
const router = express.Router();
import { v4 as uuid } from "uuid";
import { ensuredAuthenticated } from "../middleware/middleware";
import { UserModel } from "../models/User";

interface IAccountItemSchema {
  name: { type: String; required: true };
  earnOrSpend: { type: String; enum: ["earn", "spend"]; required: true };
  price: { type: Number; required: true };
}

interface IUserSchema {
  name: { type: String; required: true };
  email: { type: String; required: true };
  password: { type: String; required: true };
  accountItems: [IAccountItemSchema];
}

router.get("/", async (request, response) => {
  const userData = await UserModel.find();
  return response.json(userData);
  // response.status(201).json({ message: "Acessou a rota GET /user" });
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const findProductById = await UserModel.findOne({ _id: id });

    if (!findProductById) {
      response.status(422).json({ message: "O Produto não foi encontrado!" });
      return;
    }

    response.status(200).json(findProductById);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  console.log(request.body);

  const product: any = {
    name,
    email,
    password,
  };

  //* criando dados
  await UserModel.create(product);
  response.status(201).json({ message: "Acessou a rota POST /user" });
});

router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { name, email, password } = request.body;

  const prod = {
    name,
    email,
    password,
  };

  try {
    const user = await UserModel.updateOne({ _id: id }, prod);

    if (user.matchedCount === 0) {
      response.status(422).json({ message: "O Produto não foi encontrado!" });
      return;
    }

    response.status(200).json(prod);
  } catch (error) {
    response.status(500).json({ error: error });
  }
  // response.status(201).json({ message: "Acessou a rota PUT /user" });
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    response.status(422).json({ message: "O Produto não foi encontrado!" });
    return;
  }

  try {
    await UserModel.deleteOne({ _id: id });

    response.status(200).json({ message: "item removido com sucesso!" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

export default router;
