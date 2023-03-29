import express from 'express';
import { AuthModel } from '../models/Auth';
const router = express.Router();
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


interface IUser {
  name: string;
  email: string;
  password: string;
}

router.post('/register', async (request, response) => {
  const { name, email, password, confirmpassword } = request.body

  if (!name) {
    return response.status(422).json({ msg: 'Preencha todas as informações(name)' })
  }

  if (!email) {
    return response.status(422).json({ msg: 'Preencha todas as informações(email)' })
  }

  if (!password) {
    return response.status(422).json({ msg: 'Preencha todas as informações(password)' })
  }

  if (password !== confirmpassword) {
    return response.status(422).json({ msg: 'As senhas não conferem' })
  }

  //* Check if user exists
  const emailExists = await AuthModel.findOne({ email: email })
  console.log(emailExists)

  if(emailExists) {
    return response.status(422).json({ msg: 'Email já existente!' })
  }

  //* create password
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  //* create user
  const user:IUser = {
    name,
    email,
    password: passwordHash
  }

  try {

    await AuthModel.create(user)

    response.status(201).json({ msg: 'Usuário criado com sucesso' })
    
  } catch (error) {

    response.status(500).json({msg: error})
    
  }

});

router.post('/login', async (request, response) => {
  
  const {email, password} = request.body

  if(!email) {
    return response.status(422).json({msg: 'O email é obrigatório!'})
  }

  if(!password) {
    return response.status(422).json({msg: 'A senha é obrigatória!'})
  }

  //* Check if user exists
  const user = await AuthModel.findOne({ email: email })
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
    response.status(500).json({ msg: error })
  }

});

export default router;