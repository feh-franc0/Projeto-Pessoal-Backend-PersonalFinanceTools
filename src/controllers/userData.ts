import express from "express";
const router = express.Router();
import { v4 as uuid } from "uuid";
import { ensuredAuthenticated } from "../middleware/middleware";
import bcrypt from "bcrypt"
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken"

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

router.post("/register", async (request, response) => {
  const { name, email, password, confirmpassword } = request.body;

  if (!name) {
    return response
      .status(422)
      .json({ msg: "Preencha todas as informações(name)" });
  }

  if (!email) {
    return response
      .status(422)
      .json({ msg: "Preencha todas as informações(email)" });
  }

  if (!password) {
    return response
      .status(422)
      .json({ msg: "Preencha todas as informações(password)" });
  }

  if (password !== confirmpassword) {
    return response.status(422).json({ msg: "As senhas não conferem" });
  }

  const emailExists = await UserModel.findOne({ email: email });
  console.log(emailExists);

  if (emailExists) {
    return response.status(422).json({ msg: "Email já existente!" });
  }

  //* create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log(request.body);

  //* create user
  const user: any = {
    name,
    email,
    password: passwordHash,
  };

  try {
    //* criando dados
    await UserModel.create(user);
    response.status(201).json({ message: "Acessou a rota POST /user" });
  } catch (error) {
    response.status(500).json({ msg: error });
  }
});

router.post("/login", async (request, response) => {
  const {email, password} = request.body

  if(!email) {
    return response.status(422).json({msg: 'O email é obrigatório!'})
  }

  if(!password) {
    return response.status(422).json({msg: 'A senha é obrigatória!'})
  }

  //* Check if user exists
  const user = await UserModel.findOne({ email: email })
  console.log(user)

  if(!user) {
    return response.status(404).json({ msg: 'Usuário não encontrado!' })
  }

  //* check if password match
  const checkPassword = await bcrypt.compare(password, user.password)

  if(!checkPassword) {
    return response.status(422).json({ msg: 'Senha inválida!' })
  }

  try {
    const secret: string = process.env.SECRET!

    const token = jwt.sign(
      {
      id: user._id
      },
      secret
    )

    response.status(200).json(
      {
        msg: "Autenticação realizada com sucesso!", 
        token: token
      }
    )
  } catch (error) {
    response.status(500).json({ msg: error });
  }
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
