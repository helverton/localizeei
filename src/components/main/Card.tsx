import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useCard } from '@/hooks/useCard'

import CardMd from '@/model/CardMd'

import { FcInfo } from "react-icons/fc";
import { textAlign } from "@mui/system";


type CardProps = {
  card: CardMd
}

export default function Card(props: CardProps) {
  const { visiteds, pushVisiteds } = useCard()
  const [visited, setVisited] = useState(false)
  const { user } = useAuth()

  const fipePrice = parseFloat(props.card.fipeLast?.price)
  const cardPrice = parseFloat(props.card.price)

  async function pushVisited(idCard: string, urlCard: string) {
    if (user){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: user.id,
          card: {
            id: idCard,
            url: urlCard
          }
        })
      };

      const response = await fetch('/api/model/visiteds', requestOptions)

      const doc = await response.json()
      if (doc.success) {
        pushVisiteds(idCard, urlCard)
        setVisited(true)
      }
    }

    //alert(`Visita gravada com sucesso!`);
  }

  useEffect(() => {
    function visitedContains() {
      //console.log(visiteds)

      visiteds.map(function(vst, i) {
        if (props.card._id === vst.id) {
          //console.log(`${props.card._id} visitou`)
          setVisited(true)
        } else if (!visiteds.some(vst => vst.id === props.card._id)) {
          setVisited(false)
          //console.log(`${props.card._id} Não visitou`)
        }
      })


      // for (let idx = 0; idx < visiteds.length; idx++) {
      //   const verify = visiteds[idx].id === props.card._id;
      //   if (verify) {
      //     console.log(`${props.card._id} visitou`)
      //     setVisited(true)
      //   } else {
      //     setVisited(false)
      //     console.log(`${props.card._id} Não visitou`)
      //   }
      // }
    }

    visitedContains()
  }, [props.card._id])

  function showInfo() {
    let msg = ''
    msg += '### HISTÓRICO FIPE ### \n\r'
    msg += (props.card.fipe && props.card.fipe.history) ? props.card.fipe.history.map(txt => `${txt.date} - ${parseFloat(txt.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} \n\r`) : ''
    alert(msg)
  }

  // function getColorPrice() {
  //   if (props.card.percentFipe || props.card.percentFipe == 0) {
  //     if (props.card.percentFipe < -15) {
  //       return 'bg-green-400'
  //     }

  //     else if (props.card.percentFipe >= -15 && props.card.percentFipe < 0) {
  //       return 'bg-yellow-400'
  //     }

  //     else if (props.card.percentFipe == 0) {
  //       return 'bg-red-500'
  //     }

  //     else if (props.card.percentFipe >= 0) {
  //       return 'bg-gray-600'
  //     }

  //     else {
  //       return 'bg-gray-900'
  //     }
  //   } else {
  //     return 'bg-black';
  //   }
  // }

  return (
    <div id={props.card._id} key={props.card._id} className="border-2 rounded-t-2xl bg-gray-100 hover:border-gray-400 hover:shadow-2xl">

      <div className="rounded-t-2xl h-72 w-full">
        <div className="rounded-t-2xl h-full w-full bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${props.card.img.replace('thumbs256x256', 'images')})`}}>
          <div className="flex hover:hidden">
            <FcInfo onClick={() => showInfo()} className="w-10 h-10 bg-yellow-300 hover:w-12 hover=h-12 rounded-full"/>
            <div className={`flex items-center justify-center rounded-full mt-8 h-24 w-52 font-bold text-2xl bg-blue-400 h-4 text-white ${(props.card.closed) ? 'block' : 'hidden'}`}><p>Encerrado</p></div>
            <div className={`flex items-center justify-center rounded-full ml-auto mt-4 transform rotate-45 h-12 w-24 font-bold text-2xl bg-red-500 h-4 text-white ${(visited) ? 'block' : 'hidden'}`}><p>Visitei</p></div>
          </div>
        </div>
        {/* <img className="rounded-t-2xl h-full w-full object-cover object-center" src={props.card.img.replace('thumbs256x256', 'images')} /> */}
      </div>

      <div className="p-2">
        {/* <div className={`flex items-center justify-center bg-blue-500 h-4 rounded-full text-white ${(props.card.visited || visited) ? 'block' : 'hidden'}`}><p>Visitou</p></div> */}
        <div className="grid grid-col-2 divide-y-2">
          <p className="tracking-widest text-lg text-gray-900 font-bold">{props.card.make} - {props.card.model} - {props.card.year}</p>
          <p className="h-10 text-left tracking-widest text-sm text-gray-700 font-bold">{props.card.name.toUpperCase()}</p>
        </div>

        <div className="grid grid-col-2">
          {/* <div className="flex items-center justify-center"><p className="ml-2 text-right tracking-normal text-xl text-gray-900 font-bold bg-gray-300 border-2 border-indigo-500 rounded-xl px-2 mb-1">Variação 6 meses {(props.card.fipe.history[0].price-props.card.fipe.history[5].price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p></div> */}
          <div className="flex items-center justify-center bg-blue-500 rounded-xl text-white border-t-2 border-gray-900"><div className={`ml-1 h-4 w-4 rounded-full ${props.card.priceColor}`} /><p className="ml-2 text-right tracking-normal text-xl text-white font-bold">{cardPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} | {props.card.percentFipe?.toFixed(2)}</p>% da FIPE</div>
          <div className="flex items-center justify-center"><p className="ml-2 text-right tracking-normal text-sm text-white font-bold bg-blue-500 rounded-b-xl px-3 pb-1 mb-1">FIPE atual {fipePrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p></div>

          <div className="h-48">
            <div className="text-center text-2xl font-bold text-white bg-gray-800 rounded-t-2xl py-1">Valor médio</div>
            {
              props.card.priceComp.map(function(item, i){
                return  <div key={item.label} className={`flex w-full p-2 ${item.color} text-white border-l-2 border-r-2 border-gray-800`}>
                          <div className="font-bold pr-1">{item.label}</div>
                          <div className="font-bold pr-1 text-xl bg-gray-100 text-gray-700 rounded-xl px-2 ml-auto">{item.msg}</div>
                        </div>
              })
            }
            <div className="text-center text-4xl font-bold text-white bg-gray-800 rounded-b-2xl py-1"></div>
          </div>
        </div>

        <div className="grid grid-col-2 divide-y-2 mt-1">
          <div className="flex h-22 items-center justify-center">
            <p className="text-lg mr-auto text-gray-900 font-medium title-font">{props.card.origin} | {props.card.detail}</p>
            {/* <p className="text-lg ml-auto text-gray-900 font-medium title-font mt-4">2021 km</p> */}
          </div>
          <div className="flex h-22 items-center justify-center">
            <p className="text-lg mr-auto text-gray-900 font-medium title-font">Salvo: {new Date(props.card.created_at).toLocaleString()}</p>
            {/* <p className="text-lg ml-auto text-gray-900 font-medium title-font mt-4">2021 km</p> */}
          </div>
          <div className="flex h-10 items-center justify-center">
            <p className="tracking-widest leading-relaxed text-base">{props.card.state} - {props.card.city}</p>
            <a onClick={() => pushVisited(props.card._id, props.card.href)} className="py-2 px-6 ml-auto rounded font-medium mt-3 bg-green-700 hover:bg-green-500 text-white text-xs uppercase" href={`${props.card.href}`} target="_blank" rel="noopener noreferrer">Visitar</a>
            {/* <p className="text-lg ml-auto text-gray-900 font-medium title-font mt-4">[---]</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
