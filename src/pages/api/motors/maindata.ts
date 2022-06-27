import axios from "axios"
import fipeDB from "@/services/fipe.json"

type history = {
  date: string,
  month: number,
  year: number,
  price: number
}

export default async function handler(req, res) {
  const fipeHistory: history[] = []
  const { fipeId, year } = req.body

  async function getFipePriceWeb(tableId) {
    const url = 'http://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros'
    const body = {"codigoTabelaReferencia":tableId,"codigoTipoVeiculo":1,"anoModelo":year,"modeloCodigoExterno":fipeId,"tipoConsulta":"codigo"}
    const headers = {
      'cache-control': 'no-cache'
    }
    return await axios.post(url, body, { headers })
  }

  try {
    await Promise.all(fipeDB.map(async table => {
      await getFipePriceWeb(table.Codigo).then(response => {
        fipeHistory.push({
          date: String(table.MesAno).trim(),
          month: table.Mes,
          year: table.Ano,
          price: parseFloat(response.data.Valor.replace('R$ ', '').replace('.', '').replace(',', '.'))
        })
      })
    }))

    fipeHistory.sort(function (a, b) {
      if (parseInt(a.year.toString()+("00" + a.month.toString()).slice(-2)) < parseInt(b.year.toString()+("00" + b.month.toString()).slice(-2))) {
        return 1;
      }
      if (parseInt(a.year.toString()+("00" + a.month.toString()).slice(-2)) > parseInt(b.year.toString()+("00" + b.month.toString()).slice(-2))) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  } catch (error) {
    console.log(error)
  }

  res.status(200).json(fipeHistory)
}
