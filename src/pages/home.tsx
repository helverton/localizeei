import { useRouter } from 'next/router'
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

import { useCard } from '@/hooks/useCard'

import Layout from '@/components/main/Layout';
import Card from '@/components/main/Card';


export default function Home(props) {
  const { user, userName, role, docNum } = useAuth()
  const router = useRouter()
  const { cardsData } = useCard()

  useEffect (() => {
    function handleVerifyPlan(){
      if (user) {
        if (!userName || !role || !docNum) {
          router.push('/profile')
        }
      }
       else {
        router.push('/signin')
      }
    }

    handleVerifyPlan()
  }, [user])

  function getCount(origin) {
    let count = 0

    if (cardsData && cardsData.length > 0) {
      if (origin) {
        count = cardsData.filter(x => x.origin === origin).length;
      }

      // switch (origin) {
      //   case 'MLB':
      //     count = cardsData.filter(x => x.origin === 'MLB').length;
      //     break;
      //   case 'ICAR':
      //     count = cardsData.filter(x => x.origin === 'ICAR').length
      //     break;
      //   case 'OLX':
      //     count = cardsData.filter(x => x.origin === 'OLX').length
      //     break;
      //   case 'WBMTR':
      //     count = cardsData.filter(x => x.origin === 'WBMTR').length
      //     break;

      //   default:
      //     break;
      // }

    }

    return count
  }

  return (
    <Layout title={``} allOrigin={cardsData?.length} mlb={getCount('MLB')} icar={getCount('ICAR')} olx={getCount('OLX')} wbmtr={getCount('WBMTR')} root="Cards">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  items-center justify-center gap-2">
        {
          (cardsData.length > 0) ?
            cardsData.map(function(card, i){
              // eslint-disable-next-line react/jsx-key
              return <Card card={card} />
            })
          :
          <div className="flex justify-center items-center">
            {/* <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div> */}
          </div>
        }
      </div>
    </Layout>
  )
}

// export async function getServerSideProps() {
//   const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/motors/makes`)
//   const makes = await resp.json()

//   return {
//     props: {
//       makes: makes
//     }
//   }
// }
