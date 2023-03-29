import express from 'express';
const router = express.Router();

import axios from "axios";

router.get('/selic', async(request, response) => {

  const KeyApi = process.env.ALPHAVANTAGEKEY
  const searchStock = "ABEV3"
  const searchStockName = "itau"
  const searchStocks = ["", "", "", "", ""] //* máximo de reqs suportadas por minuto
  // const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchStock}.SAO&apikey=${KeyApi}`; //? pegar a ultima cotacao
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchStockName}&apikey=${KeyApi}`; //? pegar a ultima cotacao
  // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${searchStock}.SAO&apikey=${KeyApi}`; //? pegar todo o historico de cotacao da empresa

  try {

    axios.get(url, {
      headers: {'User-Agent': 'axios'}
    })
      .then(res => {
        let result = res.data
        return response.status(200).json(
          { result: result }
        )
      })
      .catch(error => console.error(error));
      

    
  } catch (error) {
    
    response.status(500).json({ msg: error })
    
  }

})

export default router;