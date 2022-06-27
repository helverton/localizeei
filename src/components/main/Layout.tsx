import { useRouter } from 'next/router'
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import Link from 'next/link';
import Root from "@/components/main/Root";
import SideBar from "@/components/main/SideBar";
import MobBar from "./MobBar";
import { FaBell, FaUserAlt, FaPowerOff } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
import { useFilter } from "@/hooks/useFilter";
import { useCard } from '@/hooks/useCard';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { height } from '@mui/system';

import Skeleton from '@mui/material/Skeleton';

interface LayoutProps {
  root: string
  title: string
  mlb: number
  icar: number
  olx: number
  wbmtr: number
  allOrigin: number
  children: any
}

export default function Layout(props: LayoutProps) {
  const { signOut, userName } = useAuth()
  const router = useRouter()


  const [progress, setProgress] = useState(0)


  const {
    originData,
    setOriginData,
    clearRoleAll,

    sortOrder,
    setSortOrder
  } = useFilter()
  const {
    getCardsDataDb,
    loading
  } = useCard()
  const { showMenu, setShowMenu } = useFilter()


  //const [view, setView] = useState("hidden");
  const [viewUser, setViewUser] = useState("hidden");
  const [showDscript, setShowDscript] = useState("0");

  function handleSignOut() {
    router.push('/')
    signOut()
    clearRoleAll()
  }


  // function CircularProgressWithLabel(
  //   props: CircularProgressProps & { value: number },
  // ) {
  //   return (
  //     <Box sx={{ position: 'relative', display: 'inline-flex' }}>
  //       <CircularProgress variant="determinate" {...props} />
  //       <Box
  //         sx={{
  //           top: 0,
  //           left: 0,
  //           bottom: 0,
  //           right: 0,
  //           position: 'absolute',
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center'
  //         }}
  //       >
  //         <Typography
  //           variant="caption"
  //           component="div"
  //           color="text.secondary"
  //         >{`${Math.round(props.value)}%`}</Typography>
  //       </Box>
  //     </Box>
  //   );
  // }


  const handleSelect = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value)
  };

  useEffect(() => {
    getCardsDataDb()
  }, [originData, sortOrder]);


  return (
    <div className="h-full overflow-hidden">
      <div className="flex w-full">
        <div className="flex items-center justify-center w-96 hidden md:block">
          <div className="flex pl-4 pr-4 border-b-2 border-light-blue-700 border-opacity-25 shadow-2xl bg-gray-800 sticky top-0 w-full h-14">
            <div className="hidden md:block">
              <div className="flex bg-white rounded-full w-14 h-14 items-center justify-center">
                <Link href="/">
                  <a>
                    <img className="rounded-full w-12 h-12" src="/localizeei.jpg" />
                  </a>
                </Link>
              </div>
            </div>
            <div className="block sm:hidden">
              <div className="flex bg-white rounded-full w-14 h-14 items-center justify-center">
                <Link href="/">
                  <a>
                    <img className="rounded-full w-12 h-12" src="/localizeei.jpg" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="transform h-screen overflow-y-scroll overflow-y-auto">
            <SideBar />
          </div>
        </div>


        <div className="flex flex-col w-full">
          <div className="flex pl-4 pr-4 border-b-2 border-light-blue-700 border-opacity-25 shadow-2xl bg-gray-800 sticky top-0 w-full h-14">
            <div className="block md:hidden">
              <div className="flex bg-white rounded-full w-14 h-14 items-center justify-center">
                <Link href="/">
                  <a>
                    <img className="rounded-full w-12 h-12" src="/localizeei.jpg" />
                  </a>
                </Link>
              </div>
            </div>

            <div className="flex ml-auto items-center justify-center h-14">

              <div className="flex ml-auto rounded-md mt-2">
                <span className="text-xl text-red-500 font-bold italic">{userName}</span>
              </div>

              <div className="w-10 h-10 rounded-full shadow-lg">

              {/* onClick={() => (viewUser === "hidden") ? setViewUser("block") : setViewUser("hidden")}  */}
                <div onClick={() => router.push('/profile')} className="flex rounded-md hover:bg-gray-600 mr-auto mt-2 items-center justify-center w-10 h-10 text-white">
                  <FaUserAlt className="w-6 h-6" />
                  {/* <img onClick={() => (viewUser === "hidden") ? setViewUser("block") : setViewUser("hidden")} className="h-8 w-8 rounded-full" src="/hmain.png" /> */}
                </div>
                {/* <div className="relative">
                  <div className={`absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 ${viewUser}`}>
                    <a href="#" className="block px-4 py-2 text-sm border-b capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                      your profile
                    </a>
                    <div onClick={() => handleSignOut()} className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                      <p>Sign Out</p>
                    </div>
                  </div>
                </div> */}

              </div>
              <div className="w-10 h-10 rounded-full shadow-lg">
                <div onClick={() => handleSignOut()} className="flex rounded-md hover:bg-gray-600 mr-auto mt-2 items-center justify-center w-10 h-10 text-white">
                  <FaPowerOff className="w-6 h-6" />
                </div>
              </div>
              {/* <div className="flex rounded-md hover:bg-gray-600 mr-auto mt-4 items-center justify-center w-10 h-10 text-white">
                <FaBell className="w-6 h-6" />
              </div> */}
            </div>

            <FiBarChart2 className="flex mt-4 ml-auto w-9 h-9 text-white hover:text-gray-400 transform -rotate-90 md:hidden" onClick={() => (showMenu === "hidden") ? setShowMenu("block") : setShowMenu("hidden")} />
            {/* <div className="block sm:hidden">
              <div className="flex bg-white rounded-full w-16 h-16 mt-2 items-center justify-center">
                <Link href="/">
                  <a>
                    <img className="rounded-full w-14 h-14" src="/localizeei.jpg" />
                  </a>
                </Link>
              </div>
            </div> */}
          </div>
          <div className="transform h-screen overflow-y-scroll overflow-y-auto">

            <span className={(loading > 0 && loading < 100) ? 'block' : 'hidden'}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" sx={{ backgroundColor: 'red' }} value={loading} />
              </Box>
            </span>

            <MobBar state={showMenu} />

            <div className="flex items-center h-10 p-4 border-b-2 border-light-blue-500">
              <Root>{props.root}</Root>
            </div>

            <div className={`grid grid-cols-1 xl:grid-cols-2 mt-1 p-3 ${(loading > 0 && loading < 100) ? 'hidden' : 'block'}`}>
              <div>
                <button className="text-sm bg-gray-500 hover:bg-gray-400 border-2 text-white px-5 py-1 rounded-3xl w-full sm:w-96 mb-1" onClick={() => setOriginData('')}>Todos {props.allOrigin}</button>
                <h2 className="flex text-lg font-medium mr-auto h-6">
                  {props.title}
                  <div className="flex items-center justify-center pt-4">
                    <button className="text-sm bg-yellow-500 hover:bg-yellow-400 border-2 text-white px-5 py-1 rounded-3xl" onMouseOver={() => setShowDscript('1')} onMouseLeave={() => setShowDscript('0')} onClick={() => setOriginData('MLB')}>MLB {props.mlb}<span className={(showDscript == '1') ? 'block' : 'hidden'}>MercadoLivre</span></button>
                    <button className="text-sm bg-blue-500 hover:bg-blue-400 border-2 text-white px-5 py-1 rounded-3xl" onMouseOver={() => setShowDscript('2')} onMouseLeave={() => setShowDscript('0')} onClick={() => setOriginData('ICAR')}>ICAR {props.icar}<span className={(showDscript == '2') ? 'block' : 'hidden'}>ICarros</span></button>
                    <button className="text-sm bg-purple-400 hover:bg-purple-300 border-2 text-white px-5 py-1 rounded-3xl" onMouseOver={() => setShowDscript('3')} onMouseLeave={() => setShowDscript('0')} onClick={() => setOriginData('OLX')}>OLX {props.olx}<span className={(showDscript == '3') ? 'block' : 'hidden'}>OLX</span></button>
                    <button className="text-sm bg-red-500 hover:bg-red-400 border-2 text-white px-5 py-1 rounded-3xl" onMouseOver={() => setShowDscript('4')} onMouseLeave={() => setShowDscript('0')} onClick={() => setOriginData('WBMTR')}>WBMTR {props.wbmtr}<span className={(showDscript == '4') ? 'block' : 'hidden'}>Webmotors</span></button>
                    {/* <button className="bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1">Moto</button>
                    <button className="bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1 rounded-r-3xl">Caminhão</button> */}
                  </div>
                </h2>
              </div>
              <div className="mt-8 xl:mt-2 xl:ml-auto">
                <FormControl sx={{ width: 300 }}>
                  <InputLabel id="order-select">Ordenar por</InputLabel>
                  <Select
                    labelId="option-select"
                    id="simple-option-select"
                    value={sortOrder}
                    onChange={handleSelect}
                    autoWidth
                    label="Ordenar por"
                  >
                    <MenuItem sx={{ width: 280 }} value="">
                      <em>----</em>
                    </MenuItem>
                    <MenuItem value={1}>Maior Ano</MenuItem>
                    <MenuItem value={-1}>Menor Ano</MenuItem>
                    <MenuItem value={2}>Maior Preço</MenuItem>
                    <MenuItem value={-2}>Menor Preço</MenuItem>
                    <MenuItem value={3}>Maior % Fipe</MenuItem>
                    <MenuItem value={-3}>Menor % Fipe</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className={`grid grid-cols-1 xl:grid-cols-2 mt-1 p-3 ${(loading > 0 && loading < 100) ? 'block' : 'hidden'}`}>
              <div>
                <Skeleton variant="rectangular" sx={{ bgcolor: 'gray.500' }} className="border-2 px-10 py-3 rounded-3xl w-full sm:w-96 mb-1" />
                <h2 className="flex text-lg font-medium mr-auto h-6">
                  {props.title}
                  <div className="flex items-center justify-center pt-4">
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'gray.600' }} className="border-2 px-10 py-3 rounded-3xl" />
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'gray.600' }} className="border-2 px-10 py-3 rounded-3xl" />
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'gray.600' }} className="border-2 px-10 py-3 rounded-3xl" />
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'gray.600' }} className="border-2 px-10 py-3 rounded-3xl" />
                  </div>
                </h2>
              </div>
            </div>

            <div className="p-5">
              <div className={`${(loading > 0 && loading < 100) ? 'hidden' : 'block'}`}>
                {props.children}
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  items-center justify-center gap-2 ${(loading > 0 && loading < 100) ? 'block' : 'hidden'}`}>

                <div className="border-2 bg-gray-100 shadow-2xl">
                  <div className="h-72 w-full">
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.500' }} width='100%' height='100%'/>
                  </div>
                  <div className="p-2">
                    {/* <div className={`flex items-center justify-center bg-blue-500 h-4 rounded-full text-white ${(props.card.visited || visited) ? 'block' : 'hidden'}`}><p>Visitou</p></div> */}
                    <div className="grid grid-col-2 divide-y-2">
                      <p className="tracking-widest text-lg text-gray-900 font-bold"></p>
                      <p className="h-10 text-left tracking-widest text-sm text-gray-700 font-bold"></p>
                    </div>
                    <div className="grid grid-col-2 mb-2">
                      <div className="h-48">
                        <div className="text-center text-2xl font-bold text-white bg-gray-300 rounded-t-2xl py-5"></div>
                          <Skeleton width='100%' height='64px'/>
                          <Skeleton width='100%' height='64px'/>
                        <div className="text-center text-4xl font-bold text-white bg-gray-300 rounded-b-2xl py-1"></div>
                      </div>
                    </div>
                    <div className="grid grid-col-2 divide-y-2 mt-1">
                      <div className="flex">
                        <Skeleton width='100%' height='40px' />
                      </div>
                      <div className="flex">
                        <Skeleton sx={{ bgcolor: 'grey.600' }} width='100%' height='40px' />
                      </div>
                      <div className="flex">
                        <Skeleton width='30%' sx={{ bgcolor: 'grey.800' }}className="py-2 px-6 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 bg-gray-100 shadow-2xl">
                  <div className="h-72 w-full">
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.500' }} width='100%' height='100%'/>
                  </div>
                  <div className="p-2">
                    {/* <div className={`flex items-center justify-center bg-blue-500 h-4 rounded-full text-white ${(props.card.visited || visited) ? 'block' : 'hidden'}`}><p>Visitou</p></div> */}
                    <div className="grid grid-col-2 divide-y-2">
                      <p className="tracking-widest text-lg text-gray-900 font-bold"></p>
                      <p className="h-10 text-left tracking-widest text-sm text-gray-700 font-bold"></p>
                    </div>
                    <div className="grid grid-col-2 mb-2">
                      <div className="h-48">
                        <div className="text-center text-2xl font-bold text-white bg-gray-300 rounded-t-2xl py-5"></div>
                          <Skeleton width='100%' height='64px'/>
                          <Skeleton width='100%' height='64px'/>
                        <div className="text-center text-4xl font-bold text-white bg-gray-300 rounded-b-2xl py-1"></div>
                      </div>
                    </div>
                    <div className="grid grid-col-2 divide-y-2 mt-1">
                      <div className="flex">
                        <Skeleton width='100%' height='40px' />
                      </div>
                      <div className="flex">
                        <Skeleton sx={{ bgcolor: 'grey.600' }} width='100%' height='40px' />
                      </div>
                      <div className="flex">
                        <Skeleton width='30%' sx={{ bgcolor: 'grey.800' }}className="py-2 px-6 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 bg-gray-100 shadow-2xl">
                  <div className="h-72 w-full">
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.500' }} width='100%' height='100%'/>
                  </div>
                  <div className="p-2">
                    {/* <div className={`flex items-center justify-center bg-blue-500 h-4 rounded-full text-white ${(props.card.visited || visited) ? 'block' : 'hidden'}`}><p>Visitou</p></div> */}
                    <div className="grid grid-col-2 divide-y-2">
                      <p className="tracking-widest text-lg text-gray-900 font-bold"></p>
                      <p className="h-10 text-left tracking-widest text-sm text-gray-700 font-bold"></p>
                    </div>
                    <div className="grid grid-col-2 mb-2">
                      <div className="h-48">
                        <div className="text-center text-2xl font-bold text-white bg-gray-300 rounded-t-2xl py-5"></div>
                          <Skeleton width='100%' height='64px'/>
                          <Skeleton width='100%' height='64px'/>
                        <div className="text-center text-4xl font-bold text-white bg-gray-300 rounded-b-2xl py-1"></div>
                      </div>
                    </div>
                    <div className="grid grid-col-2 divide-y-2 mt-1">
                      <div className="flex">
                        <Skeleton width='100%' height='40px' />
                      </div>
                      <div className="flex">
                        <Skeleton sx={{ bgcolor: 'grey.600' }} width='100%' height='40px' />
                      </div>
                      <div className="flex">
                        <Skeleton width='30%' sx={{ bgcolor: 'grey.800' }}className="py-2 px-6 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>


              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
