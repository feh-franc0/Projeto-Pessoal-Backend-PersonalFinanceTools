import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export async function ensuredAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.headers.authorization;

  if (!token) {
    return response.status(401).json({ msg: 'Acesso negado!'});
  }

  const [, userToken] = token.split(" ");
  console.log(userToken)

  try {

    const secret = process.env.SECRET!

    jwt.verify(userToken, secret)

    next()
    
  } catch (error) {
    response.status(400).json({ msg: "Token inválido!" })
  }
}


