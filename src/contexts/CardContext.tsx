import { createContext, ReactNode, useEffect, useState } from "react";

import { useFilter } from '@/hooks/useFilter'
import { useAuth } from "@/hooks/useAuth"


import Card from '@/model/CardMd'
import Visited from '@/model/VisitedMd'
import CardMd from "@/model/CardMd";

type CardContextType = {
  cardsData: Card[] | undefined;
  cardsAllData: Card[] | undefined;
  visiteds: Visited[] | undefined;

  loading: any | undefined;

  getCardsData: () => void;
  getCardsDataDb: () => void;
  pushVisiteds: (idCard: string, urlCard: string) => void;
}

type CardContextProviderProps = {
  children: ReactNode;
}

export const CardContext = createContext({} as CardContextType);

export function CardContextProvider(props: CardContextProviderProps) {
  const { user } = useAuth()

  const {
    valueMake,
    setValueMake,
    inputValueMake,
    setInputValueMake,
    valueModel,
    setValueModel,
    inputValueModel,
    setInputValueModel,
    valueYear,
    setValueYear,
    inputValueYear,
    setInputValueYear,
    valueVersion,
    setValueVersion,
    inputValueVersion,
    setInputValueVersion,

    versionMd,

    inputValueState,
    valueCity,

    priceClass,
    setPriceClass,

    fVisiteds,
    setFvisiteds,

    originData,
    setOriginData,

    priceGt,
    priceLt,

    fipePrcntGt,
    fipePrcntLt,


    sortOrder,
    setSortOrder,
    sortYear,
    setSortYear,
    sortPrice,
    setSortPrice,
    sortFipePrcnt,
    setSortFipePrcnt,

    clearRoleMake,
    clearRoleModel,
    clearRoleYear
  } = useFilter()

  const [cardsData, setCardsData] = useState<Card[]>([])
  const [cardsAllData, setCardsAllData] = useState<Card[]>([])

  const [loading, setLoading] = useState(0);

  const [visiteds, setVisiteds] = useState([])

  const [dataCompare, setDataCompare] = useState([])

  function pushVisiteds (idCard: string, urlCard: string) {
    visiteds.push({id: idCard, url: urlCard})
  }

  async function getFipeHistoryDb() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: `${inputValueVersion}_${inputValueYear}`
      })
    };

    return await fetch('/api/model/fipe', requestOptions)
  }

  async function getFipeHistoryWeb() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fipeId: inputValueVersion,
        year: inputValueYear
      })
    };
    return await fetch('/api/motors/maindata', requestOptions)
  }

  async function saveFipeHistoryDb(data) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: `${inputValueVersion}_${inputValueYear}`,
        history: data
      })
    };

    return await fetch('/api/model/fipe', requestOptions)
  }

  async function getFipe() {
    if (inputValueVersion != '' && inputValueYear != '') {
      const responsefipedb = await getFipeHistoryDb()
      const doc = await responsefipedb.json()

      if (doc.success && doc.message?.history) {
        //console.log(doc.message.history)

      } else {
        const responsefipeweb = await getFipeHistoryWeb()
        const data = await responsefipeweb.json()

        const responsesavefipedb = await saveFipeHistoryDb(data)
        const doc = await responsesavefipedb.json()
        //console.log(doc.message)
      }
    }
  }

  async function getCardsOnWeb() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idx: `${valueMake}_${valueModel}_${valueVersion.toLowerCase().replaceAll('  ', ' ').replaceAll('(flex)', '').replaceAll('(aut)', '').replaceAll('2p', '').replaceAll('4p', '').trim()}_${valueYear}`,
        carDscript: `${valueMake} ${valueModel} ${valueVersion.toLowerCase().replaceAll('  ', ' ').replaceAll('(flex)', '').replaceAll('(aut)', '').replaceAll('2p', '').replaceAll('4p', '').trim()} ${valueYear}`,
        fipeId: versionMd.fipeId,
        vehicleType: versionMd.vehicleType,
        bodystyleId: versionMd.bodystyleId,
        fuelId: versionMd.fuelId,
        fuelName: versionMd.fuelName,
        transmissionId: versionMd.transmissionId,
        transmissionName: versionMd.transmissionName,
        make: valueMake,
        model: valueModel,
        year: valueYear,
        version: valueVersion.toLowerCase().replaceAll('  ', ' ').replaceAll('(flex)', '').replaceAll('(aut)', '').replaceAll('2p', '').replaceAll('4p', '').trim(),
        state: inputValueState,
        city: valueCity,
        sortYear: sortYear,
        sortPrice: sortPrice,
        sortFipePrcnt: sortFipePrcnt
      })
    };

     //console.log(requestOptions)

    const data = await fetch('/api/motors/cardsdata', requestOptions)
    const mndt = await data.json()
    getFipe()
    setCardsData(mndt)
  }

  async function getVisitedsDb() {
    if (user){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: user.id
        })
      };

      const response = await fetch('/api/model/visiteds', requestOptions)

      const doc = await response.json()
      if (doc.success && doc.message?.cards) {
        setVisiteds(doc.message.cards)
      } else {
        setVisiteds([])
      }
    }
  }

  function getPriceColor(percentFipe) {
    if (percentFipe || percentFipe == 0) {
      if (percentFipe <= -15) {
        return 'bg-green-400'
      }

      else if (percentFipe > -15 && percentFipe < 0) {
        return 'bg-yellow-400'
      }

      else if (percentFipe == 0) {
        return 'bg-red-500'
      }

      else if (percentFipe >= 0) {
        return 'bg-gray-600'
      }

      else {
        return 'bg-gray-900'
      }
    } else {
      return 'bg-black';
    }
  }

  function getPriceComp(fipeId: string, state: string, city: string, cards: CardMd[]) {
    const list = []

    // if (cards && cards.length > 0 && !dataCompare.some(x => x.fipeId === fipeId)) {
      const cardsByFilter1 = cards.filter(x => x.fipeId === fipeId)
      cardsByFilter1.sort(function (a, b) {
        if (a.price > b.price) {
          return 1;
        }
        if (a.price < b.price) {
          return -1;
        }
        return 0;
      });

      const cardsByFilter2 = cards.filter(x => x.fipeId === fipeId && x.state === state)
      const cardsByFilter3 = cards.filter(x => x.fipeId === fipeId && x.city === city)

      //var arr = Object.values(data);
      let avg1: Number = Number(cardsByFilter1.map(x => x.price).reduce((prev, next) => prev + next)) / cardsByFilter1.length;

      let avg2: Number = Number(cardsByFilter2.map(x => x.price).reduce((prev, next) => prev + next)) / cardsByFilter2.length;

      let avg3: Number = Number(cardsByFilter3.map(x => x.price).reduce((prev, next) => prev + next)) / cardsByFilter3.length;

      const dataCompare =
        {
          fipeId: fipeId,
          state: state,
          city: city,
          priceFilter1Min: cardsByFilter1[0].price,
          priceFilter1Max: cardsByFilter1[cardsByFilter1.length-1].price,
          priceFilter1Avg: avg1,

          priceFilter2Min: cardsByFilter2[0].price,
          priceFilter2Max: cardsByFilter2[cardsByFilter2.length-1].price,
          priceFilter2Avg: avg2,

          priceFilter3Min: cardsByFilter3[0].price,
          priceFilter3Max: cardsByFilter3[cardsByFilter3.length-1].price,
          priceFilter3Avg: avg3,

          count: cardsByFilter1.length
        }
      // )
      //console.log(dataCompare)
    // }

    // const cardCompareByFipeId = dataCompare.find(x => x.fipeId === fipeId)
    // const cardCompareByState = dataCompare.find(x => x.fipeId === fipeId && x.state === state)
    // const cardCompareByCity = dataCompare.find(x => x.fipeId === fipeId && x.city === city)

    // console.log(cardCompareByFipeId)
    // console.log(cardCompareByState)
    // console.log(cardCompareByCity)


    list.push({
      label: "Localizeei", color: "bg-green-400", msg: `${parseFloat(dataCompare.priceFilter1Avg.toString()).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    })

    list.push({
      label: `Estado ${dataCompare.state}`, color: "bg-yellow-400", msg: `${parseFloat(dataCompare.priceFilter2Avg.toString()).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    })

    list.push({
      label: `Cidade ${dataCompare.city}`, color: "bg-red-500", msg: `${parseFloat(dataCompare.priceFilter3Avg.toString()).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    })


    // list.push({
    //   label: "Localizeei", color: "bg-green-400", msg: `de ${parseFloat(dataCompare.priceFilter1Min).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} até ${parseFloat(dataCompare.priceFilter1Max).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    // list.push({
    //   label: `Estado ${dataCompare.state}`, color: "bg-yellow-400", msg: `de ${parseFloat(dataCompare.priceFilter2Min).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} até ${parseFloat(dataCompare.priceFilter2Max).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    // list.push({
    //   label: `Cidade ${dataCompare.city}`, color: "bg-red-500", msg: `de ${parseFloat(dataCompare.priceFilter3Min).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} até ${parseFloat(dataCompare.priceFilter3Max).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    // list.push({
    //   label: "Excelente", color: "bg-green-400", msg: `Até ${Math.round(price-(price * 0.15)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    // list.push({
    //   label: "Bom", color: "bg-yellow-400", msg: `de ${(price-(price * 0.15)+1).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} até ${(price-1).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    // list.push({
    //   label: "Justo", color: "bg-red-500", msg: `${(price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    // list.push({
    //   label: "Alto", color: "bg-gray-600", msg: `${(price+0).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    // })

    return list
  }

  async function getCardsDb(vstds: string[]) {
    if (user) {
      setCardsData([])
      const body = {
        idx: (valueMake && valueModel && valueYear && valueVersion) ? `${valueMake}_${valueModel}_${valueVersion.toLowerCase().replaceAll('  ', ' ').replaceAll('(flex)', '').replaceAll('(aut)', '').replaceAll('2p', '').replaceAll('4p', '').trim()}_${valueYear}` : '',
        make: valueMake,
        model: valueModel,
        year: valueYear,
        version: valueVersion?.toLowerCase().replaceAll('  ', ' ').replaceAll('(flex)', '').replaceAll('(aut)', '').replaceAll('2p', '').replaceAll('4p', '').trim(),
        state: inputValueState,
        city: valueCity,
        priceClass: priceClass,
        originData: originData,
        priceGt: priceGt,
        priceLt: priceLt,
        fipePrcntGt: fipePrcntGt,
        fipePrcntLt: fipePrcntLt,
        sortYear: sortYear,
        sortPrice: sortPrice,
        sortFipePrcnt: sortFipePrcnt,
        fVisiteds: vstds
      }

      //console.log(body)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      };

     //console.log(requestOptions)
      //console.log(body)

      const response = await fetch('/api/model/cards', requestOptions)

      const doc = await response.json()
      //console.log(doc)
      if (doc.success) {

        const cards: CardMd[] = doc.message[0]
        const cardsAll: CardMd[] = doc.message[1]

        cards.map(card => {
          card.priceColor = 'bg-red-500'//getPriceColor(card.percentFipe)
          card.priceComp = getPriceComp(card.fipeId, card.state, card.city, cardsAll)
        })

        setCardsData(cards)
      } else {
        alert(doc.message)
      }
    }
  }


  function getCardsDataDb() {
    //getCardsAllDb()

    getVisitedsDb().then(() => {
      const vstds = []
      if (fVisiteds === '1'){
        visiteds.map(function(vst, i) { vstds.push(vst.id) })

        getCardsDb(vstds)
      } else {
        vstds.push('1')

        getCardsDb(vstds)
      }
    })
  }

  function delay(seconds, getData) {
    return (new Promise<void>((resolve) => {
      setTimeout(() => {
        if (getData) {
          getCardsDataDb()
        }
        resolve()
      }, seconds * 1000);
    }))
  }

  async function getCardsData() {
    setLoading(0);

    if (versionMd && versionMd.fipeId && valueMake && valueModel && valueVersion && valueYear) {
      getCardsOnWeb()

      // .then(result => {
      //   getCardsDataDb()
      // })

      delay(2, false).then(function(v) {
        setLoading(10)
      })
      delay(5, false).then(function(v) {
        setLoading(20)
      })
      delay(7, false).then(function(v) {
        setLoading(30)
      })
      delay(10, false).then(function(v) {
        setLoading(40)
      })
      delay(15, false).then(function(v) {
        setLoading(50)
      })
      delay(20, false).then(function(v) {
        setLoading(60)
      })
      delay(25, false).then(function(v) {
        setLoading(70)
      })
      delay(30, false).then(function(v) {
        setLoading(95)
      })
      delay(35, true).then(function(v) {
        setLoading(100)
      })
    } else {
      getCardsDataDb()
    }
  }

  useEffect(() => {
    getCardsDataDb()
  }, [user])

  return (
    <CardContext.Provider value={{ cardsData, cardsAllData, visiteds, getCardsData, getCardsDataDb, pushVisiteds, loading }}>
      {props.children}
    </CardContext.Provider>
  );
}
