import {connectToDatabase} from '@/services/mongodb'

import fipeDB from "@/services/fipe.json"

import axios from 'axios'

import fs from 'fs'

async function addFipe(req, res) {
  try {
      // connect to the database
      const { db } = await connectToDatabase();

      const { _id, history } = req.body

      const fipe = await db
          .collection('fipe')
          .findOne({ _id: _id })

      if (fipe) {
        const query = { _id : _id };
        const update = { $addToSet : { "history" : history } };
        //const options = { upsert: true };
        db.collection('fipe').updateOne(query, update);

        return res.json({
          message: 'History added successfully',
          success: true,
        });

      } else {

        const query = { _id : _id };
        const update = { $set: { history: history }};
        const options = { upsert: true };
        db.collection('fipe').updateOne(query, update, options);

        return res.json({
          message: 'History added successfully',
          success: true,
        });
      }
  } catch (error) {
      // return an error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

async function updateFipe(_id, history) {
  try {
      // connect to the database
      const { db } = await connectToDatabase();

      const query = { _id : _id };
      const update = { $set: { history: history }};
      const options = { upsert: true };
      db.collection('fipe').updateOne(query, update, options);

  } catch (error) {
      // return an error
      console.log("Falha ao executar updateFipe " + error)
  }
}

async function getFipe(req,res){
  try {
      // connect to the database
      const { db } = await connectToDatabase();
      const { _id } = req.body

      // fetch the visiteds
      const fipe = await db
          .collection('fipe')
          .findOne({ _id: _id })
          //.sort({ExternalID: 1})
          //.toArray();
      // return the fipe
      return res.json({
          message: JSON.parse(JSON.stringify(fipe)),
          success: true,
      });
  } catch (error) {
      // return the error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

async function getFipeAll() {
  try {
      // connect to the database
      const { db } = await connectToDatabase();

      // fetch the visiteds
      const fipe = await db.collection('fipe').find({}).toArray()

      return fipe
  } catch (error) {
      // return the error
      console.log("Falha ao executar fipeAll "+error)
      return []
  }
}

async function getFipeHistoryWeb(fipeId, year) {
  const url = process.env.NEXT_PUBLIC_URL+'/api/motors/maindata'
  const body = JSON.stringify({
                  fipeId: fipeId,
                  year: year
               })
  const headers = { 'Content-Type': 'application/json' }
  return await axios.post(url, body, { headers })
}

async function updateFipeHistoryWeb() {
  const list = await getFipeAll()

  list.forEach(async fipe => {
    const responsefipeweb = await getFipeHistoryWeb(fipe._id.split('_')[0], fipe._id.split('_')[1])
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = await responsefipeweb.data

    updateFipe(fipe._id, data)
  });
}

async function getFipeTable() {
  const url = 'http://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia'
  const headers = {
    'cache-control': 'no-cache'
  }
  const response = await axios.post(url)

  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho","agosto","setembro","outubro","novembro","dezembro"];
  let hoje = new Date()

  if (!fipeDB.some(x => x.MesAno === (months[(hoje.getMonth())]+"/"+hoje.getFullYear()))) {
    fipeDB.splice(0, 0, {"Codigo":response.data[0].Codigo,"Mes":hoje.getMonth()+1,"Ano":hoje.getFullYear(),"MesAno":String(response.data[0].Mes).trim()})

    fs.writeFile('./src/services/fipe.json', JSON.stringify(fipeDB), (err) => {
      if (err) console.log('Error writing file:', err);
    })

    updateFipeHistoryWeb()
  }
}

export default async function handler(req, res) {
  const { _id, history } = req.body

  getFipeTable()

  // switch the methods
  switch (req.method) {
    case 'POST': {
      if (_id && history) {
        return addFipe(req, res)
      }
      if (_id) {
        //console.log(req.body)
        return getFipe(req, res)
      }
    }

    return res.json({
      message: new Error("error").message,
      success: false,
    });
  }
}
