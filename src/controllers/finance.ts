import express from 'express';
import puppeteer from 'puppeteer';
import { ensuredAuthenticated } from "../middleware/middleware";
import axios from "axios";

const router = express.Router();

router.get('/selic', ensuredAuthenticated, async (_request, response) => {
  
  const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"

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

router.get('/ipca', ensuredAuthenticated, async (_request, response) => {
  
  const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json"

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

router.get('/cdi', ensuredAuthenticated, async (_request, response) => {
  
  const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json"

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


router.get('/stocks', ensuredAuthenticated, async (_req, res) => {
  
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto('https://www.fundamentus.com.br/resultado.php/api');
  
  const stocksTable = await page.evaluate(() => {
    
      const thead = document.querySelectorAll("#resultado thead tr th")
      var arrayThead = [...thead]
      const coluna = arrayThead.map((th) => ({
        coluna: th.childNodes[0].textContent
      }) )
      console.log(coluna)
      
      const tbody = document.querySelectorAll("#resultado tbody tr")
      var arrayTbody = [...tbody]
      const dados = arrayTbody.map((th) => ({
        Papel: th.children[0].textContent,
        Cotação: th.children[1].textContent,
        PsobreL: th.children[2].textContent,
        PsobreVP: th.children[3].textContent,
        PSR: th.children[4].textContent,
        DivYield: th.children[5].textContent,
        PsobreAtivo: th.children[6].textContent,
        PsobreCapGiro: th.children[7].textContent,
        PsobreEBIT: th.children[8].textContent,
        PsobreAtivCircLiq: th.children[9].textContent,
        EVsobreEBIT: th.children[10].textContent,
        EVsobreEBITDA: th.children[11].textContent,
        MrgEbit: th.children[12].textContent,
        MrgLíq: th.children[13].textContent,
        LiqCorr: th.children[14].textContent,
        ROIC: th.children[15].textContent,	
        ROE: th.children[16].textContent,
        Liq2meses: th.children[17].textContent,
        PatrimLíq: th.children[18].textContent,
        DívBrutsobrePatrim: th.children[19].textContent,
        CrescRec5a: th.children[20].textContent
      }) )
      console.log(dados)

      return {
        coluna,
        dados
      }
    })

  res.send(stocksTable)
  await browser.close()

})

export default router;