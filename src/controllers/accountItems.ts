import express from "express";
const router = express.Router();
import { v4 as uuid } from "uuid";
import { ensuredAuthenticated } from "../middleware/middleware";
import { UserModel } from "../models/User";

interface IAccountItem {
  name: string;
  earnOrSpend: "earn" | "spend";
  price: number;
}

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    res.send(user.accountItems);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { name, earnOrSpend, price }: IAccountItem = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const data = {
      name,
      earnOrSpend,
      price,
    };
    user.accountItems.push(data);
    await user.save();
    res.send(user.accountItems);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put("/:userId/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  const { name, earnOrSpend, price } = req.body;
  try {
    const user = await UserModel.findOne({
      _id: userId,
      accountItems: {
        $elemMatch: {
          _id: { $eq: itemId },
        },
      },
    });
    console.log(user);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const accountItemsModify = await UserModel.updateOne(
      { _id: userId, "accountItems._id": itemId },
      {
        $set: {
          "accountItems.$.name": name,
          "accountItems.$.price": price,
          "accountItems.$.earnOrSpend": earnOrSpend,
        },
      }
    );

    console.log(accountItemsModify);

    const updateAccount = await UserModel.findById(userId);

    if (!updateAccount) {
      res.status(404).send({ message: "Nao foi possivel modificar os dados" });
      return;
    }

    console.log(updateAccount);
    console.log(updateAccount.accountItems);
    const result = await UserModel.findById(userId);

    res.send({ result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    console.log(userId, itemId);
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const del = await UserModel.updateOne(
      { _id: userId },
      { $pull: { accountItems: { _id: itemId } } }
    );

    console.log(del);
    const result = await UserModel.findById(userId);

    res.send({ result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
