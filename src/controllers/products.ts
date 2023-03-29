import express from 'express';
const router = express.Router();
import { v4 as uuid } from "uuid";
import { ensuredAuthenticated } from "../middleware/middleware";
import { ProductModel } from "../models/Product"


interface ProductsDTO {
  name: string;
  description: string;
  price: number;
  id: string;
}


router.get("/all", async (request, response) => {
  const listProducts = await ProductModel.find()
  return response.json(listProducts);
});

router.get("/findByName", async (request, response) => {
  const { name } = request.query;

  try {

    const regex = new RegExp(`^${name}`, 'i');

    const findProductByName = await ProductModel.find({ name: regex })

    if(!findProductByName) {
      response.status(422).json({ message: 'O Produto não foi encontrado!' })
      return
    }
    
    response.status(200).json(findProductByName)

  } catch (error) {
    response.status(500).json({ error: error })
  }

});

router.get("/:id", async (request, response) => {
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

router.post("", ensuredAuthenticated, async (request, response) => {
  const { name, description, price } = request.body;

  if (!name) { response.status(422).json({ error: 'O nome é obrigatório' }); return }

  if (!description) { response.status(422).json({ error: 'A descrição é obrigatória' }); return }

  if (!price) { response.status(422).json({ error: 'O preço é obrigatório' }); return }

  const product: ProductsDTO = {
    description,
    name,
    price,
    id: uuid(),
  };

  try {
    //* criando dados
    await ProductModel.create(product)
    
    response.status(201).json({ message: 'Produto inserido no sistema' })

  } catch (error) {
    response.status(500).json({ error: error })
  }

});

router.put("/:id", ensuredAuthenticated, async (request, response) => {
  const { id } = request.params;
  const { name, description, price } = request.body;

  const prod = {
    name,
    description,
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

    response.status(200).json({ message: 'Usuário removido com sucesso!' })
    
  } catch (error) {
    response.status(500).json({ error: error })
  }

});

export default router;