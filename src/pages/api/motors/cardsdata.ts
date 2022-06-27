import { getIcar, getOlx, getMlb, getWbmtr } from "@/pages/api/_lib/chromium"
import {connectToDatabase} from '@/services/mongodb';

import CardMd from '@/model/CardMd'

import statesDB from "@/services/states.json"

const states = statesDB

type Filter = {
  carDscript: string,
  make: string,
  model: string,
  year: string,
  version: string,
  state: string
}

export default async function handler(req, res) {
  const {carDscript, fipeId, vehicleType, bodystyleId, fuelId, fuelName, transmissionId, transmissionName, make, model, year, version, state, city } = req.body

  const filter: Filter = {
    carDscript,
    make,
    model,
    year,
    version,
    state
  }

  function similarity(a, b, type) {
    var longer = a.split(" ").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")});
    var shorter = b.split(" ").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")});
    var countA = longer.length
    var countB = 0

    var countC = 0
    var countD = 0
    var countE = 0

    countE = Math.max.apply(Math, longer.map(function(o) { return o.length; }))

    for(var i = 0; i < longer.length; i++){

      countC+= longer[i].length

      if (shorter.includes(longer[i])){
        countB+=1
        countD+= (longer[i].length == countE) ? longer[i].length + 2 : longer[i].length
      }
    }
    if (type == 'version' && countB*100/countA > 0 && countB*100/countA < 100) {
      // console.log(`${JSON.stringify(a.split(" ").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}))} //// ${JSON.stringify(b.split(" ").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}))}`)
      // console.log(` ${countB*100/countA} //// /// ${countE} ///   ${countC} % ${countD} ${(countD*100/countC >= 60) ? 75 : countD*100/countC} = ${countD*100/countC}`)

      return (countD*100/countC >= 60) ? 75 : countD*100/countC
    }

    return countB*100/countA
  }

  function saveCards(cardsdata: any[]) {
    try {
      for (let i = 0; i < cardsdata.length; i++) {

        //cardsdata[i].percent = similarity(carDscript.split('||')[0], cardsdata[i].name)

        let makePrcnt = similarity(make.toUpperCase(), cardsdata[i].name.toUpperCase(), 'make')
        let modelPrcnt = similarity(model.toUpperCase(), cardsdata[i].name.toUpperCase(), 'model')
        let yearPrcnt = similarity(year.toUpperCase(), cardsdata[i].name.toUpperCase(), 'year')
        let versionPrcnt = similarity(version.toUpperCase(), cardsdata[i].name.toUpperCase(), 'version')

        //console.log(versionPrcnt)

        var auxPrcnt = (makePrcnt == 100) ? 25 : 0
        auxPrcnt += (modelPrcnt == 100) ? 25 : 0
        //auxPrcnt += (yearPrcnt == 100) ? 15 : 0
        auxPrcnt += (auxPrcnt == 50) ? ((versionPrcnt >= 95) ? 50 : (versionPrcnt >= 75 && versionPrcnt <= 94) ? 30 : (versionPrcnt >= 15 && versionPrcnt <= 74) ? 15 : versionPrcnt) : 0
        cardsdata[i].percent = auxPrcnt

        // console.log(versionPrcnt + '=====' + version.split(" ").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}).length + '=====' + JSON.stringify(version.split(" ").filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")})) + '-----' + version.toUpperCase() + '=====' + cardsdata[i].name.toUpperCase())
        // console.log(auxPrcnt)

        //console.log(cardsdata[i])


        if (cardsdata[i].percent <= 79 || !cardsdata[i].price || cardsdata[i].price == 0 || cardsdata[i].price == null || cardsdata[i].price == '') {
          cardsdata.splice(i, 1);
          i--;
        } else {
          cardsdata[i].price = parseFloat(cardsdata[i].price)

          cardsdata[i]._id = `${make}_${cardsdata[i]._id}`
          cardsdata[i].idx = `${make}_${model}_${version}_${year}`
          cardsdata[i].fipeId = `${fipeId}_${year}`

          cardsdata[i].vehicleType = vehicleType
          cardsdata[i].bodystyleId = bodystyleId
          cardsdata[i].fuelId = fuelId
          cardsdata[i].fuelName = fuelName
          cardsdata[i].transmissionId = transmissionId
          cardsdata[i].transmissionName = transmissionName

          cardsdata[i].make = make
          cardsdata[i].model = model
          cardsdata[i].year = year
          cardsdata[i].version = version

          if (cardsdata[i].state.length > 2) cardsdata[i].state = getStateId(cardsdata[i].state)

          cardsdata[i].closed = false
          cardsdata[i].visited = false

          cardsdata[i].created_at = new Date()
        }
        //console.log(cardsdata[i])
      }

      //console.log(cardsdata)
      if (cardsdata.length > 0) {
        //console.log(cardsdata[0])

        PushCards(cardsdata)
      }
    } catch (error) {
      console.log("falha saveCards" + error)
    }
  }

  async function getCardsData() {
    let data = []

    //time//10 segundos
    try {
      const mlb = await getMlb(filter, isDev);
      if (mlb) {
        //data.push(...mlb)
        saveCards(mlb)
      }
    } catch (error) {
      console.log("falha getMlb" + error)
    }

    //time//10 segundos
    try {
      const wbMtrs = await getWbmtr(filter, isDev);
      if (wbMtrs) {
        //data.push(...mlb)
        saveCards(wbMtrs)
      }
    } catch (error) {
      console.log("falha getWbmtr" + error)
    }

    //time//10 segundos
    try {
      const olx = await getOlx(filter, isDev);
      if (olx) {
        //data.push(...olx)
        saveCards(olx)
      }
    } catch (error) {
      console.log("falha getOlx" + error)
    }

    //time//10 segundos
    try {
      const icarros = await getIcar(filter, isDev);
      if (icarros) {
        //data.push(...icarros)
        saveCards(icarros)
      }
    } catch (error) {
      console.log("falha getIcar" + error)
    }

    // console.log(data)

    //return data
  }


  function getStateId(stateName: string) {
    const state = states.find(state => state.label == stateName)
    //console.log(state.id)
    return state.id
  }

  async function PushCards(cards: CardMd[]) {

    try {
      //const cardsNews = JSON.stringify(cards)

      const { db } = await connectToDatabase();

      cards.map(function(card, c){
        const query = { _id : card._id };
        const update = { $set: JSON.parse(JSON.stringify(card)) };
        const options = { upsert: true };
        db.collection('cards').updateOne(query, update, options);
      })

      //await db.collection('cards').insertMany(JSON.parse(cardsNews));

    } catch (error) {
        console.log("falha PushCards" + error)
    }

    return
  }

  let isDev = (process.env.NEXT_PUBLIC_URL == 'http://localhost:3000') ? true : false

  //const cardsdata = await
  getCardsData();



  res.status(200).json({ sucess: 'RUN' })// cardsdata })
}
