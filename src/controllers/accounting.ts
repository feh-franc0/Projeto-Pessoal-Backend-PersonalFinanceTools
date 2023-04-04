import express from 'express';
const router = express.Router();
import { v4 as uuid } from "uuid";
import { ensuredAuthenticated } from "../middleware/middleware";
import { ProductModel } from "../models/Product"


interface ProductsDTO {
  name: string;
  earnOrSpend: string;
  price: number;
  id: string;
}


router.get("/all", ensuredAuthenticated, async (request, response) => {
  const listProducts = await ProductModel.find()
  return response.json(listProducts);
});

router.get("/summary", ensuredAuthenticated, async (request, response) => {
  
  const listProducts = await ProductModel.find()
  
  // return response.json(listProducts);

  // Array de objetos com a estrutura {name: x, earnOrSpend: x, price: x}
  const transactions = listProducts

  // Use o método reduce para somar o valor dos objetos com earnOrSpend igual a 'earn'
  const totalEarn = transactions.reduce((acc, transaction) => {
    if (transaction.earnOrSpend === "earn") {
      return acc + transaction.price;
    }
    return acc;
  }, 0);

  // Use o método reduce para subtrair o valor dos objetos com earnOrSpend igual a 'spend'
  const totalSpend = transactions.reduce((acc, transaction) => {
    if (transaction.earnOrSpend === "spend") {
      return acc - transaction.price;
    }
    return acc;
  }, 0);

  // Exibe o resultado
  console.log(`Total de ganhos: R$${totalEarn}`);
  console.log(`Total de gastos: R$${totalSpend}`);

  const summary = totalEarn + totalSpend

  
  return response.json({
    totalEarn: totalEarn,
    totalSpend: totalSpend,
    summary: summary
  });


});

router.get("/:id", ensuredAuthenticated, async (request, response) => {
  const { id } = request.params;
  
  try {
    const findProductById = await ProductModel.findOne({ _id: id })

    if(!findProductById) {
      response.status(422).json({ message: 'O Produto não foi encontrado!' })
      return
    }
    
    response.status(200).json(findProductById)

  } catch (error) {
    response.status(500).json({ error: error })
  }

});

router.post("/", ensuredAuthenticated, async (request, response) => {
  const { name, earnOrSpend, price } = request.body;

  if (!name) { response.status(422).json({ error: 'O nome é obrigatório' }); return }

  if (!earnOrSpend) { response.status(422).json({ error: 'A earnOrSpend é obrigatória' }); return }

  if (!price) { response.status(422).json({ error: 'O preço é obrigatório' }); return }

  const product: ProductsDTO = {
    earnOrSpend,
    name,
    price,
    id: uuid(),
  };

  try {
    //* criando dados
    await ProductModel.create(product)
    
    response.status(201).json({ message: 'Accounting inserido no sistema' })

  } catch (error) {
    response.status(500).json({ error: error })
  }

});

router.put("/:id", ensuredAuthenticated, async (request, response) => {
  const { id } = request.params;
  const { name, earnOrSpend, price } = request.body;

  const prod = {
    name,
    earnOrSpend,
    price
  }

  try {

    const updatedProduct = await ProductModel.updateOne({_id: id}, prod)

    if (updatedProduct.matchedCount === 0) {
      response.status(422).json({ message: 'O Produto não foi encontrado!' })
      return
    }

    response.status(200).json(prod)
    
  } catch (error) {
    response.status(500).json({ error: error })
  }

});

router.delete("/:id", ensuredAuthenticated, async (request, response) => { 
  
  const { id } = request.params;  

  const prod = await ProductModel.findOne({ _id: id})
  
  if (!prod) {
    response.status(422).json({ message: 'O Produto não foi encontrado!' })
    return
  }

  try {

    await ProductModel.deleteOne({_id: id})

    response.status(200).json({ message: 'item removido com sucesso!' })
    
  } catch (error) {
    response.status(500).json({ error: error })
  }

});

export default router;